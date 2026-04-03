import re

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
