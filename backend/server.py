from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'metaprompt_db')]

# Emergent LLM configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
LLM_API_URL = "https://ai-gateway.emergent.sh/api/v1/chat/completions"

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class PromptRequest(BaseModel):
    task: str
    inputs: List[str] = []
    structure: Optional[str] = None
    api_key: Optional[str] = None  # BYOK - Bring Your Own Key
    provider: Optional[str] = "openai"  # openai, anthropic, openrouter
    model: Optional[str] = None  # Custom model for OpenRouter

class PromptResponse(BaseModel):
    prompt: str
    tokens_used: Optional[int] = None
    provider_used: Optional[str] = None
    model_used: Optional[str] = None


# System prompt for metaprompt generation
METAPROMPT_SYSTEM = """You are an expert prompt engineer. Your job is to write detailed, effective instructions for AI assistants based on task descriptions.

When given a task description, input variables, and optional structure preferences, create comprehensive prompt instructions that will help the AI assistant perform the task consistently and accurately.

Follow these guidelines:
1. Start with clear role/context setting
2. Include specific rules and constraints
3. Use the provided input variables in {$VARIABLE_NAME} format
4. Add examples when helpful
5. Specify output format clearly
6. Use XML tags for structure when appropriate
7. For complex reasoning tasks, include scratchpad/thinking sections

Your output should be the complete prompt template that can be used directly."""


def build_generation_prompt(task: str, inputs: List[str], structure: Optional[str]) -> str:
    """Build the prompt for the LLM to generate metaprompt instructions."""
    
    prompt = f"""Create detailed AI assistant instructions for the following task:

<Task>
{task}
</Task>

<Inputs>
{chr(10).join([f'{{${inp}}}' for inp in inputs]) if inputs else 'No specific input variables defined - determine appropriate ones based on the task.'}
</Inputs>

"""
    
    if structure:
        prompt += f"""<Preferred Structure>
{structure}
</Preferred Structure>

"""
    
    prompt += """Now write comprehensive instructions for an AI assistant to complete this task. Include:
1. Clear role definition and context
2. Important rules and constraints  
3. Input variable placements
4. Examples if helpful
5. Output format specification

Write the complete prompt template:"""
    
    return prompt


# API Provider configurations
API_PROVIDERS = {
    "openai": {
        "url": "https://api.openai.com/v1/chat/completions",
        "model": "gpt-4o-mini",
    },
    "anthropic": {
        "url": "https://api.anthropic.com/v1/messages",
        "model": "claude-3-haiku-20240307",
    },
    "openrouter": {
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "model": "openai/gpt-4o-mini",
    }
}


async def generate_with_llm(prompt: str, api_key: Optional[str] = None, provider: str = "openai", model: Optional[str] = None) -> tuple[str, str, str]:
    """Generate prompt using provided API key or fallback."""
    
    # Use provided key or fall back to Emergent key
    key_to_use = api_key if api_key else EMERGENT_LLM_KEY
    
    if not key_to_use:
        return generate_fallback(prompt), "fallback", "template"
    
    provider_config = API_PROVIDERS.get(provider, API_PROVIDERS["openai"])
    
    # Use custom model if provided (mainly for OpenRouter)
    if model and model != 'custom':
        provider_config = {**provider_config, "model": model}
    
    if provider == "anthropic":
        result, prov = await generate_with_anthropic(prompt, key_to_use, provider_config)
        return result, prov, provider_config["model"]
    elif provider == "openrouter":
        result, prov = await generate_with_openrouter(prompt, key_to_use, provider_config)
        return result, prov, provider_config["model"]
    else:
        result, prov = await generate_with_openai(prompt, key_to_use, provider_config)
        return result, prov, provider_config["model"]

async def generate_with_openai(prompt: str, api_key: str, config: dict) -> tuple[str, str]:
    """Generate using OpenAI-compatible API."""
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": config["model"],
        "messages": [
            {"role": "system", "content": METAPROMPT_SYSTEM},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 2000,
        "temperature": 0.7
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(config["url"], headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"], "openai"
        except Exception as e:
            logging.error(f"OpenAI API error: {e}")
            return generate_fallback(prompt), "fallback"


async def generate_with_openrouter(prompt: str, api_key: str, config: dict) -> tuple[str, str]:
    """Generate using OpenRouter API."""
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://metaprompt.app",
        "X-Title": "MetaPrompt Generator"
    }
    
    payload = {
        "model": config["model"],
        "messages": [
            {"role": "system", "content": METAPROMPT_SYSTEM},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 2000,
        "temperature": 0.7
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(config["url"], headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"], "openrouter"
        except Exception as e:
            logging.error(f"OpenRouter API error: {e}")
            return generate_fallback(prompt), "fallback"


async def generate_with_anthropic(prompt: str, api_key: str, config: dict) -> tuple[str, str]:
    """Generate using Anthropic Claude API."""
    
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": config["model"],
        "max_tokens": 2000,
        "system": METAPROMPT_SYSTEM,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post(config["url"], headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["content"][0]["text"], "anthropic"
        except Exception as e:
            logging.error(f"Anthropic API error: {e}")
            return generate_fallback(prompt), "fallback"


def generate_fallback(prompt: str) -> str:
    """Generate a template-based prompt when LLM is not available."""
    
    # Extract task and inputs from the prompt
    task_start = prompt.find("<Task>") + 6
    task_end = prompt.find("</Task>")
    task = prompt[task_start:task_end].strip() if task_start > 5 and task_end > 0 else "the specified task"
    
    inputs_start = prompt.find("<Inputs>") + 8
    inputs_end = prompt.find("</Inputs>")
    inputs_text = prompt[inputs_start:inputs_end].strip() if inputs_start > 7 and inputs_end > 0 else ""
    
    # Parse inputs
    inputs = []
    if inputs_text and "No specific input" not in inputs_text:
        import re
        inputs = re.findall(r'\{\$(\w+)\}', inputs_text)
    
    # Build template
    template = f"""You will be acting as an AI assistant to help with the following task.

<Task>
{task}
</Task>

"""
    
    if inputs:
        template += """Here are the input variables you will work with:
<Inputs>
"""
        for inp in inputs:
            template += f"{{${inp}}}\n"
        template += """</Inputs>

"""
    
    template += """Important rules for the interaction:
- Stay focused on the task at hand
- Be clear and precise in your responses
- If you're unsure about something, ask for clarification
- Follow any specific formatting requirements mentioned in the task

"""
    
    if inputs:
        template += """When processing the inputs:
"""
        for inp in inputs:
            template += f"- Use the {{${inp}}} value as provided\n"
        template += "\n"
    
    template += """Think through your response carefully before providing it. If the task requires reasoning, show your work in <thinking></thinking> tags before giving your final answer.

Provide your response in a clear, structured format appropriate for the task.

BEGIN TASK

"""
    
    if inputs:
        for inp in inputs:
            template += f"{{${inp}}}\n\n"
    
    return template


# Add your routes to the router
@api_router.get("/")
async def root():
    return {"message": "MetaPrompt Generator API"}


@api_router.post("/generate-prompt", response_model=PromptResponse)
async def generate_prompt(request: PromptRequest):
    """Generate AI prompt instructions based on task description."""
    
    if not request.task or len(request.task.strip()) < 10:
        raise HTTPException(status_code=400, detail="Task description must be at least 10 characters")
    
    try:
        # Build the generation prompt
        generation_prompt = build_generation_prompt(
            task=request.task,
            inputs=request.inputs,
            structure=request.structure
        )
        
        # Generate using LLM with BYOK support
        generated_prompt, provider_used, model_used = await generate_with_llm(
            generation_prompt,
            api_key=request.api_key,
            provider=request.provider or "openai",
            model=request.model
        )
        
        # Save to database for analytics (optional)
        await db.generated_prompts.insert_one({
            "task": request.task,
            "inputs": request.inputs,
            "structure": request.structure,
            "generated_prompt": generated_prompt,
            "provider_used": provider_used,
            "model_used": model_used,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        
        return PromptResponse(prompt=generated_prompt, provider_used=provider_used, model_used=model_used)
        
    except Exception as e:
        logging.error(f"Error generating prompt: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate prompt")


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
