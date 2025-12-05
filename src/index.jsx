/***************************************************************
 * PURPOSE:
 *   - Bootstrap the React application
 *   - Create the React root
 *   - Provide the Redux store to the entire app
 *   - Render <ReactRoot />
 *
 * ARCHITECTURE RULES:
 *   - NO business logic
 *   - NO API calls
 *   - NO presenters or views imported here
 ***************************************************************/

import React from "react";
import { createRoot } from "react-dom/client";

// TODO: import the top-level App wrapper component
import { ReactRoot } from "./reactRoot.jsx";

// TODO: import Redux Provider + configured store
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

// Dispatch APP_INIT once at startup
store.dispatch({ type: "APP_INIT" });

// Create the React root
const root = createRoot(document.getElementById("root"));

// TODO: Render the application wrapped in Redux Provider
root.render(
    <Provider store={store}>
        <ReactRoot />
    </Provider>
);
