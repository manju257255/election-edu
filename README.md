# ElectionEdu

ElectionEdu is a high-performance React + Vite single page app designed to improve Indian election literacy through AI-driven personalization, interactive journey maps, and real-time assessments.

## Architecture

```text
[ Browser / Frontend ]
       |
       +-- [ React Components ] -- [ Error Boundary ]
       |          |
       |          +-- [ State Management (Hooks) ]
       |          +-- [ Utils: Sanitize, Tag, Translate ]
       |
       +-- [ Google Services ]
       |          |
       |          +-- [ Gemini 2.0 Flash API (via fetch) ]
       |          +-- [ Google Translate API ]
       |          +-- [ Firebase Analytics (GA4) ]
       |
       +-- [ Firebase Backend ]
                  |
                  +-- [ Firestore (Sessions, Analytics, Quiz Scores) ]
                  +-- [ Firebase Auth (Anonymous) ]
                  +-- [ Firebase Storage (Document Uploads) ]
```

## Google Services Used

- **Gemini 2.0 Flash API**: Powers the personalized election assistant.
- **Google Translate API**: Provides real-time translation of assistant responses to Hindi.
- **Firebase Analytics (GA4)**: Tracks user engagement events (chat topics, quiz completion, etc.).
- **Firebase Auth**: Enables anonymous user sessions for data persistence.
- **Firestore**: Scalable NoSQL database for session and analytics storage.
- **Firebase Hosting**: Fast and secure global hosting.

## Key Features

### Accessibility Statement
ElectionEdu is built with accessibility as a priority:
- Full keyboard navigation support with `:focus-visible` styles.
- ARIA live regions for dynamic chat updates.
- Skip navigation link for screen reader efficiency.
- Semantic HTML5 structure and descriptive labels.
- Sufficient color contrast for readability.

### Security
- **Content Security Policy (CSP)**: Strict policy enforced via meta tags to prevent XSS and unauthorized connections.
- **Input Sanitization**: All user inputs are stripped of HTML tags and trimmed.
- **Rate Limiting**: Session-based message limits to prevent API abuse.
- **Firestore Security Rules**: Strict per-user data isolation.

### Efficiency
- **Lazy Loading**: Route-based code splitting using `React.lazy` and `Suspense`.
- **Memoization**: Expensive computations and pure components are memoized with `useMemo` and `React.memo`.
- **Lightweight Dependencies**: Direct `fetch` calls used for Google APIs to reduce bundle size.

## Development

### Install
```bash
npm install
```

### Environment
Create a `.env` file with your API keys:
```bash
VITE_GEMINI_API_KEY=your_key
VITE_TRANSLATE_API_KEY=your_key
```

### Testing
We use Vitest for comprehensive unit testing.
```bash
npm test
```

### Build & Deploy
```bash
npm run build
firebase deploy
```
