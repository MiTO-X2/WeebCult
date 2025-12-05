WeebCult is an anime quiz site, where you can pick any anime and play varying quizzes ranging from character names, ages and other tid bits of knowledge. 

We have implemented:
- a main page, which shows lists of different genres + currently trending animes
  - In practice aesthetically done, different elements/buttons/search bar are final
- a pop up appears when any anime is pressed, which displays quiz options to choose from
- logic for login functionality (no view currently)

We are planning to: 
- add consistency to the page, information such as recently played quizzes
- quizzes, both solo and 1v1 (on the same computer), timed and untimed modes and etc

Project file structure:
- api
  - Contains functions for fetching data from our API:s (Jikan): 
  - animeSource.js: searching animes with different parameters, finding character info
  - api.config: contains Proxy key and Proxy link
- firebase
  - firebaseConfig.js: different keys, appID and info for firebase
  - firestoreModel.js: login functionality using google authentication
- presenters
  - fetches information from redux (application state/model) hands info to view:
  - animeDetailsPresenter.jsx: for popup when an anime portrait is pressed
  - authPresenter.jsx: for authentification to update view when change in state occurs
  - gamePresenter.jsx: for showing the quiz when playing
  - headerPresenter.jsx: managing changes for the website header (when logo is clicked)
  - mainPagePresenter.jsx: mounting anime in the main page 
  - searchPresenter.jsx: handles search page logic
  - testPresenter.jsx: presenter for first demo
- redux
  - stores application state/model
    - slices
    - animeSlice.js: Store/fetch anime search/trending/genre results
    - detailsSlice.js: store anime ID, fetch character and anime details
    - quizSlice.j: manages quiz state: score, questions, mode and etc
    - userSlice.js: stores info for the user, managing login and logout
  - rootReducer.js: combines all slice reducers to a single root reducer
  - store.js: creates redux stores and importsslices
- views
 - just look at the website plz, me no need explain 

