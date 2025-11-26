import { createRoot } from "react-dom/client";
import { searchAnime, getTopAnime, getGenres, getAnimeByGenre, getAnimeCharacters } from "./api/animeSource.js";
import { createMiniModel } from "./miniModel.js";
import { resolvePromise } from "./resolvePromise.js";
import { TestPresenter } from "./presenters/testPresenter.jsx";


// Create a React root for rendering into the DOM element with id="root"
const root = createRoot(document.getElementById("root"));

// Create a mini model instance to hold application state (for debug purpose)
const model = createMiniModel();

// 1) Initial render (for debug purpose)
// Render the presenter component and pass the model as a prop
// At this point, model.promiseState.promise is null → shows "Loading..."
root.render(<TestPresenter model={model} />);


// 2) Resolve a promise and update the model's promise state (for debug purpose)
// Test and uncomment one resolvePromise at a time and check the UI (view) in the app
/*resolvePromise(
    searchAnime("naruto"),                    // The promise returned by the API call
    model.promiseState,                       // The object to store promise, data, error
    function() { model.notifyObservers(); }   // Notify all observers (components) to re-render
);*/

/*resolvePromise(
    getTopAnime(),
    model.promiseState,
    function() { model.notifyObservers(); }
);*/

/*resolvePromise(
    getGenres(),
    model.promiseState,
    function() { model.notifyObservers(); }
);*/

resolvePromise(
    getAnimeByGenre(1),
    model.promiseState,
    function() { model.notifyObservers(); }
);

/*resolvePromise(
    getAnimeCharacters(20),
    model.promiseState,
    function() { model.notifyObservers(); }
);*/

/***************************************************************************************************
// TODO: This file is responsible ONLY for bootstrapping the React app.
//       - Create the React root
//       - Provide the Redux store to the entire application
//       - Render <App />
//       - NO business logic, NO API calls, NO presenters, NO views here.

import React from "react";
import ReactDOM from "react-dom/client";

// TODO: import the top-level App component
import { ReactRoot } from "./reactRoot.jsx";

// TODO: import Redux provider + configured store
// import { Provider } from "react-redux";
// import { store } from "./redux/store";

// TODO: Render the application root
ReactDOM.createRoot(document.getElementById("root")).render(
    //   <Provider store={store}>
            <App />
    //   </Provider>
);

// NOTES:
// - DO NOT import presenters here.
// - DO NOT import animeSource.js here.
// - DO NOT fetch API data in this file.
// - Purpose: wrap App in providers (Redux, Router, etc.).
***************************************************************************************************/
