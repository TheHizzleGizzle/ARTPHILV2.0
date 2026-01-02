# MetaPrompt Generator - Product Requirements Document

## Overview
MetaPrompt Generator is a wizard-based AI prompt engineering tool that helps users create detailed, optimized instructions for AI assistants. The application guides users through a step-by-step process to build comprehensive prompt templates.

## Features

### Core Functionality
1. **4-Step Wizard Flow**
   - Define Task: Enter task description with suggestions
   - Add Inputs: Define input variables (e.g., {$DOCUMENT}, {$QUESTION})
   - Plan Structure: Choose from Simple, Detailed, or Structured templates
   - Generate: Create AI-optimized prompt instructions

2. **Live Preview Panel**
   - Real-time preview of the prompt being built
   - Summary tab showing configuration breakdown
   - Toggle between Preview and Summary views

3. **Prompt Library**
   - Pre-built templates for common use cases:
     - Customer Support Agent
     - Sentence Comparison
     - Document Q&A
     - Socratic Math Tutor
     - Function Caller
     - Content Summarizer
   - Category filtering and search

4. **History Management**
   - Browser-based storage of generated prompts
   - Quick access to previously generated prompts
   - Clear history functionality

5. **Export Options**
   - Copy to clipboard
   - Download as .md file

### Technical Stack
- **Frontend**: React, Tailwind CSS, Shadcn/UI, Framer Motion
- **Backend**: FastAPI (Python)
- **AI Integration**: Emergent LLM key (OpenAI-compatible) with fallback template generator
- **Storage**: Browser localStorage for history, MongoDB for analytics

### Design System
- **Primary Color**: Coral/Peach (hsl: 15 85% 60%)
- **Secondary Color**: Soft Mint (hsl: 165 45% 88%)
- **Accent Color**: Warm Lavender (hsl: 270 50% 90%)
- **Typography**: Fredoka (headings), Fira Code (monospace)
- **Style**: Playful, creative with smooth animations

## API Endpoints
- `POST /api/generate-prompt` - Generate AI prompt from task, inputs, and structure
- `GET /api/` - Health check

## User Flow
1. User opens the app and sees Step 1 (Define Task)
2. User enters task description or clicks a suggestion
3. Clicks "Next Step" to proceed to Add Inputs
4. Adds input variables or uses quick-add buttons
5. Clicks "Next Step" to Plan Structure
6. Selects a structure template or customizes
7. Clicks "Next Step" to reach Generate step
8. Clicks "Generate Prompt" to create the prompt
9. Reviews, edits, copies or downloads the generated prompt

## Notes
- Prompt generation uses fallback template when AI API is unavailable
- All generated prompts are saved to browser history
- Library templates can be loaded as starting points
