# CLAUDE.md - Project Guidelines for AI Assistants

## Project Overview

MetaPrompt Generator is a wizard-based AI prompt engineering tool that helps users create detailed, optimized instructions for AI assistants. The application guides users through a 4-step process to build comprehensive prompt templates.

## Tech Stack

### Frontend (`/frontend`)
- **Framework**: React 19 with CRACO configuration
- **Styling**: Tailwind CSS 3.4 + Shadcn/UI components
- **Animations**: Framer Motion
- **State Management**: React hooks + localStorage
- **HTTP Client**: Axios
- **Package Manager**: Yarn 1.22

### Backend (`/backend`)
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn
- **Database**: MongoDB (via Motor async driver)
- **Testing**: Pytest
- **Linting**: Flake8, Black, isort, mypy

## Commands

### Frontend (run from `/frontend`)
```bash
yarn install          # Install dependencies
yarn start            # Start dev server (uses CRACO)
yarn build            # Production build
yarn test             # Run tests
```

### Backend (run from `/backend`)
```bash
pip install -r requirements.txt   # Install dependencies
uvicorn server:app --reload       # Start dev server
pytest                            # Run tests
```

### Code Quality (Backend)
```bash
black .               # Format code
isort .               # Sort imports
flake8 .              # Lint code
mypy .                # Type checking
```

## Project Structure

```
/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components (Shadcn/UI)
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer
│   │   ├── lib/              # Utility functions
│   │   ├── App.js            # Main app component
│   │   └── index.js          # Entry point
│   ├── public/               # Static assets
│   ├── plugins/              # CRACO/build plugins
│   ├── tailwind.config.js    # Tailwind configuration
│   └── package.json          # Frontend dependencies
├── backend/
│   ├── server.py             # FastAPI application
│   └── requirements.txt      # Python dependencies
├── tests/                    # Test files
└── memory/
    └── PRD.md                # Product requirements document
```

## API Endpoints

- `POST /api/generate-prompt` - Generate AI prompt from task, inputs, structure, and optional API key
- `GET /api/` - Health check

## Design System

- **Primary Color**: Coral/Peach (`hsl(15, 85%, 60%)`)
- **Secondary Color**: Soft Mint (`hsl(165, 45%, 88%)`)
- **Accent Color**: Warm Lavender (`hsl(270, 50%, 90%)`)
- **Typography**: Fredoka (headings), Fira Code (monospace)
- **Style**: Playful, creative with smooth animations
- **Dark Mode**: Full support with proper contrast

## Key Features

1. **4-Step Wizard Flow**: Define Task → Add Inputs → Plan Structure → Generate
2. **Live Preview Panel**: Real-time preview with Summary toggle
3. **Prompt Library**: 45+ templates across 10 categories
4. **History Management**: Browser-based storage of generated prompts
5. **Export Options**: Copy to clipboard, download as .md
6. **BYOK Support**: OpenAI, Anthropic, OpenRouter API key integration
7. **Dark Mode**: Toggle with persistence

## Development Guidelines

- Frontend uses path aliases configured in `jsconfig.json` and `craco.config.js`
- Shadcn/UI components are in `frontend/src/components/ui/`
- API calls should go through the services layer in `frontend/src/services/`
- Environment variables should be in `.env` files (gitignored)
- Never commit API keys or credentials

## Testing

- Frontend: Jest/React Testing Library via `yarn test`
- Backend: Pytest for Python tests
- Test files should be in `/tests` directory or colocated with components
