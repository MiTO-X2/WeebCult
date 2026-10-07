# WeebCult 🎌

**Anime Quiz Platform built with React & Redux**

🔗 **Live Application:**  
👉 https://weebcult-81f89.web.app

---

**WeebCult** — _Test your anime knowledge. One quiz at a time._ 🎌

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Anime Discovery](#anime-discovery)
  - [Quiz System](#quiz-system)
  - [Game Score Screen](#game-score-screen)
  - [Global Leaderboard](#global-leaderboard)
  - [User Experience](#user-experience)
  - [Persistence & Authentication](#persistence--authentication)
- [Third-Party Components Used](#third-party-components-used)
- [External APIs Used](#external-apis-used)
- [Application Architecture](#application-architecture)
- [Project File Structure](#project-file-structure)
- [Documentation](#documentation)
- [Setup & Installation](#setup--installation)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Configure Firebase and API Access](#configure-firebase-and-api-access)
  - [Run Development Server](#run-development-server)
  - [Build for Production](#build-for-production)
  - [Preview the Production Build](#preview-the-production-build)
  - [Run Tests](#run-tests)
  - [Deployment](#deployment)
- [Credits](#credits)
- [Data & API Disclaimer](#data--api-disclaimer)
- [Learning Outcomes](#learning-outcomes)

---

## Overview

**WeebCult** is a full-featured anime quiz web application that allows users to search for anime titles and play interactive quizzes based on characters, trivia, and anime-related knowledge.  
The application is built with **React**, **Redux Toolkit**, and **Firebase**, and integrates real-world anime data through public APIs.

The project follows a clean and scalable architecture that separates **UI components**, **presentation logic**, **state management**, and **data sources**, ensuring maintainability, clarity, and extensibility.

---

## Key Features

### Anime Discovery

- Search anime by title with filtering options
- Browse trending anime and genres
- View anime details before starting a quiz

### Quiz System

- Multiple quiz modes, categories, and types
- Timed and untimed quizzes
- Visual countdown for timed quizzes
- Real-time score tracking
- Dynamic question generation based on anime data

### Game Score Screen

- Displays the user’s final score
- Shows quiz metadata:
  - Category
  - Mode
  - Quiz type
- Provides:
  - **Play Again** button
  - **Return to Main Screen** button

### Global Leaderboard

- Displays ranked users based on quiz performance
- Uses Firestore persistence
- Dynamically updates via Redux listeners and selectors

### User Experience

- Sidebar popup showing:
  - The **3 most recently played quizzes per user**
  - Interactive flip-card UI revealing quiz details
  - Random anime image fetched from a secondary API
- Smooth loading states using suspense loaders
- Responsive and interactive UI design

### Persistence & Authentication

- Firebase Authentication (Google Sign-In)
- Firestore database for storing user quiz history
- User-specific recent quiz tracking

---

## Third-Party Components Used

The following **user-visible third-party components** are integrated into the application:

### 1. MoonLoader

📦 **Library:** `react-spinners`  
📍 **Used in:** `suspenseView`

- Displays a professional loading spinner while authentication or data is initializing.

---

### 2. CountdownCircleTimer

📦 **Library:** `react-countdown-circle-timer`  
📍 **Used in:** `gameView`

- Visual countdown timer for timed quizzes.
- Enhances urgency and user engagement during gameplay.

---

### 3. CardFlip

📦 **Library:** `react-card-flip`  
📍 **Used in:** `sidebarView`

- Interactive flip-card component.
- Displays the last **3 recently played quizzes**.
- Flip interaction reveals:
  - Score
  - Anime title
  - Quiz mode
  - Category
  - Quiz type
  - Time played

---

## External APIs Used

### 1. Jikan API

🔗 https://jikan.moe/

- Primary data source for the application.
- Used to:
  - Search anime
  - Fetch anime details
  - Retrieve characters
  - Generate quiz questions dynamically
- Most of the app’s logic and content is built around this API.

---

### 2. Nekos API

🔗 https://nekos.best/

- Used in the sidebar to fetch and display a random anime image.
- Adds visual variety and personality to the UI.

---

## Application Architecture

The project follows a **layered architecture inspired by MVP principles**:

- **Views:** Pure UI components (no logic, no API calls)
- **Presenters:** Connect Redux state and callbacks to views
- **Redux:** Centralized state management (slices, reducers, middleware)
- **API Layer:** All external data fetching
- **Firebase Layer:** Authentication and persistence

This design ensures:

- Predictable data flow
- Clear separation of concerns
- High maintainability and scalability

---

## Project File Structure

### `src/api`

Contains functions for fetching data from the Jikan and Nekos APIs:

- **animeSource.js:** Searches anime, fetches character information, and supplies quiz data through Jikan.
- **nekoSource.js:** Fetches random anime images through Nekos API.
- **apiConfig.js:** Configures the API proxy used by Jikan and Nekos. Use proxy access details provided by your course or proxy provider.

### documents

- **User_Evaluation_WeebCult.pdf:** Pre-user evaluation document (prototyping stage)
- **formative-evaluation.pdf:** Formative evaluation and feedback analysis

### `src/firebase`

Manages authentication and database access:

- **firebaseConfig.js:** Firebase web-app configuration used by the application.
- **firestoreModel.js:** Firebase Authentication and Firestore persistence.

### `src/presenters`

Fetches information from Redux (application state/model) and passes it to views:

- **animeDetailsPresenter.jsx:** Handles anime details and quiz setup.
- **gamePresenter.jsx:** Handles quiz display and gameplay.
- **gameScorePresenter.jsx:** Handles the post-quiz score screen.
- **headerPresenter.jsx:** Manages header, search, and filtering interactions.
- **leaderboardPresenter.jsx:** Handles the global leaderboard.
- **mainPagePresenter.jsx:** Mounts anime lists on the main page.
- **sidebarPresenter.jsx:** Handles recent quiz scores and the random Nekos image.

### `src/redux`

Stores application state and model:

- **listeners:** Contains custom Redux middleware listeners

  - **detailsListener.js:** Handles side effects for anime details
  - **leaderboardListener.js:** Leaderboard-related async logic
  - **listenerMiddleware.js:** Main listener middleware (anime & genre rendering)
  - **quizListener.js:** Quiz lifecycle side effects
  - **sidebarListener.js:** Sidebar persistence & updates
  - **userListener.js:** User-related persistence and updates

- **selectors:**

  - **leaderboardSelectors.js:** Derived leaderboard state.
  - **quizSelectors.js:** Derived quiz state (score, progress)

- **slices**

  - **animeSlice.js:** Stores/fetches anime search, trending, and genre results
  - **detailsSlice.js:** Stores anime ID and fetches character/anime details
  - **leaderboardSlice.js:** Global leaderboard state
  - **nekoSlice.js:** Nekos API image state
  - **quizSlice.js:** Manages quiz state, including score, questions, mode, etc
  - **sidebarSlice.js:** Sidebar UI & recent quiz state
  - **userSlice.js:** Stores user information and manages login/logout (Authentication & user state)

- **thunks:**

  - **quizThunks.js:** Async quiz-related logic.
  - **userThunks.js:** Authentication & user persistence logic

- **rootReducer.js:** Combines all Redux slice reducers into a single root reducer
- **store.js:** Creates Redux store configuration and imports slices

### `src/views`

UI components that render the website:

- **animeDetailsView.jsx:** Anime details popup UI
- **footerView.jsx:** Footer with logo and text
- **gameScoreView.jsx:** Score screen after quiz completion
- **gameView.jsx:** Quiz UI
- **headerView.jsx:** Header UI for (e.g., logo, app title, search bar and filtering)
- **leaderboardView.jsx:** Global leaderboard UI
- **mainPageView.jsx:** Main landing page UI
- **rowView.jsx:** Renders anime rows per genre
- **sidebarView.jsx:** Sidebar popup UI
- **suspenseView.jsx:** Loader UI (MoonLoader)

### Application entry points and tests

- **src/index.jsx:** App bootstrap.
- **src/reactRoot.jsx:** Application root, routing, and navigation.
- **src/setupTests.js:** Shared Vitest setup.
- **tests/E2ETesting.spec.js:** Playwright end-to-end tests.
- **src/redux/slices/*.test.js:** Vitest unit tests for Redux slices.

- **index.html:** Vite HTML entry point.
- **vite.config.js:** Vite and Vitest configuration.
- **playwright.config.js:** Playwright browser and end-to-end test configuration.
- **firebase.json** and **firestore.rules:** Firebase Hosting and Firestore rules configuration.
- **main.tf**, **variables.tf**, and **.terraform.lock.hcl:** Optional Terraform configuration for Firebase and Google Cloud resources.

---

## Documentation

The `/documents` folder contains evaluation material produced during the development process:

- **Pre-User Evaluation:**  
  Initial assumptions, user expectations, and early design validation

- **Formative Evaluation:**  
  Iterative feedback analysis and improvements applied to the final application

These documents reflect the user-centered design process followed throughout development.

---

### WeebCult demonstrates:

- Clean React + Redux architecture
- Proper separation of concerns
- Real-world API integration
- Thoughtful UI/UX design
- Production-ready deployment

---

## Setup & Installation

### Prerequisites

- **Git** to clone the repository.
- **Node.js 20.19+ or 22.12+** (required by the Vite version in this project). npm is included with Node.js.
- A modern browser.
- **Optional, for end-to-end tests:** Playwright browser binaries (installed below).
- **Optional, for deployment/infrastructure work:** Firebase CLI, Terraform CLI, and Google Cloud CLI with access to the target project.

Install optional infrastructure tools from the [Terraform](https://developer.hashicorp.com/terraform/install) and [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installation guides. The Firebase CLI install command is included in the deployment section.

On Windows, install Git and the Node.js LTS release from their official downloads:

- [Git for Windows](https://git-scm.com/download/win)
- [Node.js](https://nodejs.org/en/download)

After installation, open a new terminal and confirm both tools are available:

```sh
git --version
node --version
npm --version
```

### Clone the Repository

```sh
git clone https://github.com/MiTO-X2/WeebCult.git
cd WeebCult
```

### Install Dependencies

Install the exact dependency versions recorded in the lockfile:

```sh
npm ci
```

### Configure Firebase and API Access

The application reads its Firebase web-app configuration from `src/firebase/firebaseConfig.js`; a separate `.env` file is not currently used. To connect the application to your own Firebase project, register a web app and put its Firebase configuration in that file. Enable Google as a sign-in provider in Firebase Authentication and set up Firestore in the Firebase console. You also need access to the configured Firestore database and its rules.

Jikan and Nekos requests use the proxy configuration in `src/api/apiConfig.js`. If the configured proxy details are not available to you, obtain authorized values from the proxy provider and update that file. Do not commit private credentials or access keys.

### Run Development Server

```sh
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:8080`).

### Build for Production

```sh
npm run build
```

The production files are written to `dist/`.

### Preview the Production Build

```sh
npm run serve
```

Open the preview URL printed by Vite.

### Run Tests

Run the Redux slice unit tests:

```sh
npx vitest run
```

Run the Playwright end-to-end tests against a production preview:

```sh
npm run build
npx playwright install
npx playwright test
```

Playwright installs Chromium, Firefox, and WebKit for the configured desktop and mobile browser projects. These tests use the external anime APIs, so proxy access must be configured.

### Deployment

The application is deployed using Firebase Hosting. To deploy, install the [Firebase CLI](https://firebase.google.com/docs/cli), sign in with an account authorized for the target project, then build and deploy:

```sh
npm install --global firebase-tools
firebase login
npm run build
firebase deploy --only hosting --project weebcult-81f89
```

Only deploy if you are authorized to update the selected Firebase project. For a different project, use its project ID and update `.firebaserc` and the Firebase app configuration accordingly.

The Terraform files at the repository root are optional infrastructure provisioning, not required to run the application. They target the existing Firebase/Google Cloud project configured by `project_id` in `variables.tf` (also reflected in `.firebaserc`); they do not create a separate Google Cloud project. Terraform use requires the Terraform CLI, Google Cloud CLI, appropriate project permissions, and Google Application Default Credentials (for example, `gcloud auth application-default login`). Initialize and review the proposed changes before making any:

```sh
terraform init
terraform plan
```

Do not run `terraform apply` unless you are authorized to modify the selected project and have reviewed the plan.

---

## Credits

This project was developed as part of an academic React & Redux application project and represents a complete, production-style single-page application.

### Technologies & Tools

- **Vitest** – Unit test runner
- **Playwright** – End-to-end browser tests
- **Terraform** – Optional Firebase and Google Cloud infrastructure provisioning

- **React** – Component-based UI framework
- **Redux Toolkit** – Centralized state management
- **Firebase** – Authentication, Firestore database, and hosting
- **Vite** – Development server and build tool
- **JavaScript** – Application logic
- **CSS** – Styling and layout

### Third-Party Libraries

- `react-spinners` – Loading indicators
- `react-countdown-circle-timer` – Timed quiz countdowns
- `react-card-flip` – Interactive flip-card UI
- `react-redux` – Redux bindings for React

---

## Data & API Disclaimer

All anime-related data, images, and metadata are provided by third-party public APIs:

- **Jikan API** (MyAnimeList unofficial API)
- **Nekos API**

This application is for **educational and non-commercial purposes only**.  
All anime titles, characters, and images belong to their respective copyright holders.

---

## Learning Outcomes

This project demonstrates proficiency in:

- React component design and lifecycle management
- Redux state architecture and middleware usage
- API-driven application development
- Asynchronous data handling
- UI/UX design with third-party components
- Firebase authentication and persistence
- Clean separation of concerns and scalable architecture
