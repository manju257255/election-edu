---

# ElectionEdu — Election Process Education Assistant

## Overview
ElectionEdu is an AI-powered civic education platform built to help 
Indian voters — especially first-time voters — understand the complete 
election process through an interactive AI assistant, journey map, 
timeline, glossary, and quiz.

| | |
|---|---|
| Hackathon | Hack2Skill PromptWars |
| Challenge Vertical | Election Process Education |
| Built With | Google Antigravity |
| Live Demo | https://election-edu-1be18.web.app |

> This project was built entirely using **Google Antigravity** — 
> Hack2Skill's AI-powered development platform. Every component, 
> test, configuration, and deployment was generated and refined 
> through iterative natural language prompting inside Antigravity.

---

## Problem Statement
Millions of Indian citizens lack clear, accessible information about 
how elections work. ElectionEdu provides a personalized AI assistant 
that explains the election process in simple, structured language — 
tailored to the user's state and experience level.

---

## How It Was Built with Google Antigravity
The entire development lifecycle was completed inside Google Antigravity:
- React + Vite app scaffolded via Antigravity prompts
- Firebase services integrated through natural language instructions
- Security rules, CSP headers, and input sanitization generated via prompting
- 32 unit tests written and verified through Antigravity
- Performance optimizations (code splitting, gzip, memoization) applied via prompts
- Deployed to Firebase Hosting directly from the Antigravity environment

---

## Evaluation Factor Coverage

### 1. Code Quality
- Modular React component architecture with clear separation of concerns
- All utility functions documented with JSDoc comments
- PropTypes validation on every component
- Global ErrorBoundary prevents application crashes
- Consistent named exports across all modules
- Zero console.log statements in production build
- Code split into logical chunks: Chat, Quiz, Glossary, JourneyMap, Timeline
- File structure:
  src/
  ├── components/     React UI components
  ├── utils/          sanitize.js, tagger.js, translate.js
  ├── tests/          7 test files, 32 tests
  ├── data/           glossaryTerms.js, quizQuestions.js, journeySteps.js
  ├── gemini.js       Gemini API integration
  ├── session.js      Session ID management
  └── firebase.js     Firebase initialization

### 2. Security
- Firestore rules: read/write restricted strictly to authenticated user's own UID
- Content Security Policy (CSP) meta tag blocks XSS, restricts external connections
- All chat inputs sanitized via src/utils/sanitize.js before processing
- Rate limiting: maximum 20 messages per session enforced client-side
- API keys stored in .env environment variables — never hardcoded in source
- Anonymous authentication ensures no personal data is collected
- No wildcard rules in Firestore — exact path matching only

### 3. Efficiency
- React.lazy() and Suspense for all tab components — on-demand loading
- Manual chunk splitting in vite.config.js:
  - Main bundle: 196KB (reduced from 720KB)
  - Firebase chunk: ~510KB (separated from app logic)
  - React vendor chunk: ~11KB
- Gzip compression via vite-plugin-compression
- useMemo and React.memo on expensive components
- Service worker (public/sw.js) for offline asset caching
- Resource hints in index.html: preconnect, dns-prefetch for external APIs
- Chat virtualization: renders only last 50 messages in DOM
- Loading skeletons during async operations

### 4. Testing
32 unit tests across 7 test files using Vitest:

| File | Tests | Coverage |
|---|---|---|
| tagger.test.js | All keyword categories, case insensitivity, default fallback |
| sanitize.test.js | HTML stripping, whitespace trimming, empty input |
| session.test.js | Unique ID generation, format validation |
| glossary.test.js | Search filtering, empty state, no-match state |
| quiz.test.js | Score increment, wrong answer, reset logic |
| gemini.test.js | API integration, error handling, key validation |
| chat.test.js | Message handling, rate limiting, session management |

Run: npm test

### 5. Accessibility
- WCAG 2.1 AA compliant
- Skip navigation link as first focusable element
- aria-live="polite" on chat messages for screen readers
- aria-label on every icon-only button
- role="status" on quiz feedback
- lang="en" on <html> element
- All inputs have associated <label> elements
- Full keyboard navigation: tabs, steps, quiz, glossary
- focus-visible indicators on all interactive elements
- High contrast black theme with 4.5:1+ contrast ratio
- Respects prefers-reduced-motion

### 6. Google Services
| Service | Integration |
|---|---|
| Google Gemini 2.0 Flash | AI chat assistant with engineered system prompt |
| Firebase Anonymous Auth | Auto sign-in, session persistence across visits |
| Firebase Firestore | Chat sessions, user profile, analytics logging |
| Firebase Hosting | Production deployment at web.app |
| Firebase Analytics GA4 | Tracks chat, quiz, journey, glossary events |
| Google Translate API | Real-time Hindi translation of AI responses |

---

## Features
1. AI Chat Assistant — Gemini-powered, personalized to state and voter profile
2. Election Journey Map — 7 interactive expandable steps
3. Visual Timeline — Gantt-style 5-month election cycle view
4. Glossary — 15 terms with live search
5. Quiz — 8 questions with AI explanations and score history
6. Progress Dashboard — journey completion and quiz scores
7. Hindi Translation — toggle English/Hindi for AI responses
8. Offline Support — service worker for static asset caching

---

## Prompt Engineering
The Gemini system prompt is engineered to:
- Personalize by user state and first-time voter status
- Format responses as numbered steps only
- End every response with one follow-up suggestion
- Correct EVM tampering and NOTA misconceptions directly
- Redirect off-topic questions back to election content
- Define technical terms inline for first-time voters
- Limit responses to 180 words for readability
- Never reference AI companies or model names

---

## Setup

### Prerequisites
- Node.js 18+
- Firebase CLI: npm install -g firebase-tools

### Local Development
git clone https://github.com/YOUR_USERNAME/election-edu.git
cd election-edu
npm install

Create .env:
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_TRANSLATE_API_KEY=your_translate_api_key

npm run dev

### Run Tests
npm test

### Deploy
npm run build && firebase deploy

---

## Architecture
User Browser
    │
    ├── React + Vite (Frontend, code-split, gzipped)
    │       ├── Firebase Anonymous Auth
    │       ├── Google Gemini 2.0 Flash API
    │       ├── Google Translate API
    │       ├── Firebase Firestore
    │       └── Firebase Analytics GA4
    │
    └── Firebase Hosting → https://election-edu-1be18.web.app

---

## Assumptions
- Content focused on Indian general and state elections
- Hindi translation covers AI responses only
- Anonymous auth is sufficient — no personal data collected
- Gemini free tier sufficient for hackathon traffic

---

## License
MIT

---
