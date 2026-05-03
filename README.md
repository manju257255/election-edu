# ElectionEdu

ElectionEdu is a React + Vite single page app for learning the Indian election process. It includes a personalized election assistant, journey map, timeline, searchable glossary, generated quiz, document upload, anonymous Firebase persistence, and Firebase Hosting configuration.

## Prerequisites

1. Node 18 or newer
2. Firebase CLI
3. A Firebase project with Anonymous Auth, Firestore, Storage, and Hosting enabled
4. A Gemini API key

## Install

```bash
npm install
```

## Environment

Create a `.env` file in the project root:

```bash
VITE_GEMINI_API_KEY=your_key_here
VITE_GEMINI_MODEL=gemini-2.5-flash
```

If Google returns a quota error, use an API key from a Google Cloud project with available Gemini quota or enable billing for that project. After changing `.env`, rebuild before deploying because Vite embeds `VITE_*` values during build.

## Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com).
2. Create a project or open an existing project.
3. Enable Authentication, then enable Anonymous sign-in.
4. Create a Firestore database.
5. Enable Firebase Storage.
6. Register a web app and copy the Firebase config.
7. Replace the placeholder config in `src/firebase.js`.
8. Update `.firebaserc` so `your-project-id` matches your Firebase project ID.
9. Deploy Firestore and Storage rules when deploying the app.

Firestore rules included in this project allow read and write only when `request.auth != null`, so anonymous users are covered after sign-in.

## Local Development

```bash
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`.

## Production Build and Deploy

```bash
npm run build
firebase deploy
```

The live URL will be:

```text
https://your-project-id.web.app
```

## Data Model

1. `sessions/{anonymousUID}` stores onboarding answers, journey progress, and update timestamps.
2. `sessions/{anonymousUID}/chats/{sessionId}` stores each fresh visit chat with `sessionId`, `messages`, and timestamps. Previous chats are kept for records but are never loaded back into the chat UI.
3. `quizScores/{anonymousUID}` stores `bestScore` and a `scores` history array with `score`, `total`, `state`, `learningGoal`, and timestamp.
4. Firebase Storage stores uploaded documents at `uploads/{anonymousUID}/{timestamp}-{filename}`.
