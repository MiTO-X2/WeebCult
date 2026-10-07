# WeebCult 🎌

WeebCult is an anime quiz web app that lets users browse anime titles, open detailed entries, and test their knowledge with character and trivia-based quiz flows.

Live app: https://weebcult-81f89.web.app

## Overview

WeebCult is built with React, Redux Toolkit, Vite, and Firebase. It pulls anime data from the Jikan API, uses Nekos for random anime artwork, and stores leaderboard and recent-quiz data in Firestore.

The app is structured around a presenter/view architecture with centralized Redux state, listener middleware, and Firebase-backed auth and persistence. It is designed for quick quiz sessions, search-driven discovery, and a polished anime-themed user experience.

## Features

- Search and browse anime entries by title and category
- Open animated anime detail popups before starting a quiz
- Generate quiz sessions from anime metadata and character data
- Timer-based quiz gameplay and score tracking
- Result screen with replay and return flow
- Global leaderboard using Firestore
- Recent quiz history sidebar for the signed-in user
- Firebase Google sign-in support
- Random anime artwork from Nekos API
- Loading screens for async auth and data initialization
- Browser-based E2E validation with Playwright

## Stack

- React
- Vite
- Redux Toolkit
- React Router
- Firebase Authentication + Firestore
- Jikan API
- Nekos API
- Playwright
- Terraform

## Architecture

The project follows a layered structure:

- Views: presentational UI components
- Presenters: state-to-view wiring and interaction handling
- Redux slices, thunks, and listeners: state and side effects
- API layer: Jikan and Nekos requests
- Firebase layer: auth, user session, leaderboard, and recent quiz history

The application bootstrap starts in src/index.jsx, while the main route and shell are defined in src/reactRoot.jsx.

## Repository Structure

```text
.
├── firebase.json
├── firestore.rules
├── index.html
├── main.tf
├── package.json
├── playwright.config.js
├── README.md
├── variables.tf
├── src/
│   ├── api/
│   │   ├── animeSource.js
│   │   ├── apiConfig.js
│   │   └── nekoSource.js
│   ├── firebase/
│   │   ├── firebaseConfig.js
│   │   └── firestoreModel.js
│   ├── presenters/
│   │   ├── animeDetailsPresenter.jsx
│   │   ├── gamePresenter.jsx
│   │   ├── gameScorePresenter.jsx
│   │   ├── headerPresenter.jsx
│   │   ├── leaderboardPresenter.jsx
│   │   ├── mainPagePresenter.jsx
│   │   └── sidebarPresenter.jsx
│   ├── redux/
│   │   ├── listeners/
│   │   ├── selectors/
│   │   ├── slices/
│   │   ├── thunks/
│   │   ├── rootReducer.js
│   │   ├── store.js
│   │   └── ...
│   ├── views/
│   │   ├── animeDetailsView.jsx
│   │   ├── footerView.jsx
│   │   ├── gameScoreView.jsx
│   │   ├── gameView.jsx
│   │   ├── headerView.jsx
│   │   ├── leaderboardView.jsx
│   │   ├── mainPageView.jsx
│   │   ├── rowView.jsx
│   │   ├── sidebarView.jsx
│   │   └── suspenseView.jsx
│   ├── index.jsx
│   ├── reactRoot.jsx
│   ├── setupTests.js
│   ├── style.css
│   └── WeebCultLogo.png
├── tests/
│   └── E2ETesting.spec.js
├── test-results/
├── documents/
└── ...
```

## Local Development

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm run serve
```

## Testing

The project includes Playwright end-to-end tests for main flows including:

- anime category rendering
- leaderboard behavior
- recent quiz sidebar
- anime search
- starting a quiz

Run the suite with:

```bash
npx playwright test
```

The Playwright config starts a preview server automatically and runs across Chromium, Firefox, WebKit, and Mobile Safari.

## Firebase and Deployment

The app uses Firebase Hosting through firebase.json and stores persistent user and leaderboard data in Firestore.

Important project files:

- src/firebase/firebaseConfig.js
- firebase.json
- firestore.rules
- main.tf
- variables.tf

Terraform provisions the Firebase and Firestore resources used by the project, while the app itself is deployed via Firebase Hosting.

## Notes

- The app uses a hash-based router in src/reactRoot.jsx.
- The Redux store restores quiz state from localStorage in src/redux/store.js.
- Auth initialization is triggered from src/index.jsx on startup.
- External internet access is required for Jikan and Nekos API calls.

## Useful Commands

```bash
npm install
npm run dev
npm run build
npx playwright test
```

This project is a Vite-based SPA for anime quiz gameplay, Firebase-backed persistence, and real-world API-driven content discovery.

## Learning Outcomes

This project demonstrates proficiency in:

- React component design and lifecycle management
- Redux state architecture and middleware usage
- API-driven application development
- Asynchronous data handling
- UI/UX design with third-party components
- Firebase authentication and persistence
- Clean separation of concerns and scalable architecture
