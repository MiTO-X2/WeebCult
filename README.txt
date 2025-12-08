# WeebCult

WeebCult is an anime quiz site where you can pick any anime and play a variety of quizzes, ranging from character names and ages to other fun tidbits of knowledge.

---

## Features Implemented

- **Main Page:**  
  Displays lists of different genres and currently trending anime.  
  - Aesthetically complete with final layout, buttons, and search bar.
  - You can search for a specific anime and filter the search based on your preference.
- **Anime Popup:**  
  Clicking on any anime shows a popup with quiz options.
  You can also click on the anime title and be directed to the anime details page, to read more about the anime before playing.
- **Login Logic:**  
  Basic login functionality implemented (but not yet accessible).

---

## Planned Features

- **Page Consistency:**  
  Show recently played quizzes and other user-specific information.
- **Quizzes:**  
  Solo and 1v1 modes (same computer), timed and untimed quizzes, and more.
- **Persistence:**
  Persist some values in the firestore database, which will be used later to access a leaderboard and a sidebar popup for recent quiz scores. 

---

## Project File Structure

### api
Contains functions for fetching data from external APIs (Jikan).  
- **animeSource.js:** Searching anime with different parameters and fetching character info.  
- **api.config.js:** Stores proxy key and proxy URL.

### firebase
Manages authentication and database access.  
- **firebaseConfig.js:** Contains Firebase keys, appID, and configuration.  
- **firestoreModel.js:** Implements login functionality using Google authentication.

### presenters
Fetches information from Redux (application state/model) and passes it to views.  
- **animeDetailsPresenter.jsx:** Handles popup when an anime poster is clicked.    
- **gamePresenter.jsx:** Handles quiz display and gameplay logic.  
- **headerPresenter.jsx:** Manages header interactions (e.g., logo click and search bar).  
- **mainPagePresenter.jsx:** Mounts anime lists on the main page.  
- **sidebarPresenter.jsx:** Handles the sidebar popup responsible for rendering recent quiz scores and random anime fact from the 2nd API.

### redux
Stores application state and model. 
- **listeners:** Contains custom middleware listeners. 
- **slices**  
  - **animeSlice.js:** Stores/fetches anime search, trending, and genre results.  
  - **detailsSlice.js:** Stores anime ID and fetches character/anime details.  
  - **quizSlice.js:** Manages quiz state, including score, questions, mode, etc.  
  - **userSlice.js:** Stores user information and manages login/logout.  
- **rootReducer.js:** Combines all slice reducers into a single root reducer.  
- **store.js:** Creates Redux store and imports slices.

### views
UI components that render the website. Check the site for details.

---

