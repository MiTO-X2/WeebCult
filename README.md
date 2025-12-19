# WeebCult 🎌

**Anime Quiz Platform built with React & Redux**

🔗 **Live Application:**  
👉 https://weebcult-81f89.web.app

---

**WeebCult** — _Test your anime knowledge. One quiz at a time._ 🎌

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

### api

Contains functions for fetching data from external APIs (Jikan):

- **animeSource.js:** Searching anime with different parameters and fetching character info. Jikan API calls (search, characters, quiz data)
- **nekoSource.js:** Nekos API integration (random anime images)
- **api.config.js:** API configuration and proxy settings (Stores proxy key and proxy URL)

### documents

- **User-Evaluation-WeebCult.pdf:** Pre-user evaluation document (prototyping stage)
- **formative-evaluation.pdf:** Formative evaluation and feedback analysis

### firebase

Manages authentication and database access:

- **firebaseConfig.js:** Contains Firebase keys, appID, and configuration
- **firestoreModel.js:** Implements functionality for authentication & firestore persistence

### presenters

Fetches information from Redux (application state/model) and passes it to views:

- **animeDetailsPresenter.jsx:** Handles popup logic when an anime poster is clicked and contains the settings for the quiz to play
- **gamePresenter.jsx:** Handles quiz display and gameplay logic
- **gameScorePresenter.jsx:** Post-quiz score screen logic
- **headerPresenter.jsx:** Manages header interactions (e.g., logo click and search bar and filtering)
- **leaderboardPresenter.jsx:** Global leaderboard logic.
- **mainPagePresenter.jsx:** Mounts anime lists on the main page
- **sidebarPresenter.jsx:** Handles the sidebar popup responsible for rendering recent quiz scores and random anime img from the second API (Nekos API usage)

### redux

Stores application state and model:

- **listeners:** Contains custom Redux middleware listeners

  - **detailsListener.js:** Handles side effects for anime details
  - **leaderboardListener.js:** Leaderboard-related async logic
  - **listenerMiddleware.js:** Main listener middleware (anime & genre rendering)
  - **quizListener.js:** Quiz lifecycle side effects
  - **sidebarListener.js:** Sidebar persistence & updates

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

### views

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

### index.jsx

App bootstrap

### reactRoot.jsx

Application root, routing & navigation

### index.html

---

## Additional Screens & Flows

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

- Node.js (v18 or newer recommended)
- npm or yarn

### Install Dependencies

npm install

### Run Development Server

npm run dev

### Build for Production

npm run build

### Deployment

The application is deployed using Firebase Hosting.

---

## Credits

This project was developed as part of an academic React & Redux application project and represents a complete, production-style single-page application.

### Technologies & Tools

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
