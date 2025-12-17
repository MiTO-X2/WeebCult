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

import { createRoot } from "react-dom/client";
import { ReactRoot } from "./reactRoot.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { listenToAuthChangesThunk } from "./redux/thunks/userThunks.js";

store.dispatch(listenToAuthChangesThunk());

// Dispatch APP_INIT once at startup
store.dispatch({ type: "APP_INIT" });

// Create the React root
const root = createRoot(document.getElementById("root"));

// Render the application wrapped in Redux Provider
root.render(
    <Provider store={store}>
        <ReactRoot />
    </Provider>
);
