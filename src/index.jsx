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
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store.js";
import { listenToAuthChangesThunk } from "./redux/thunks/userThunks.js";

// Dispatch thunks
store.dispatch(listenToAuthChangesThunk());
store.dispatch({ type: "APP_INIT" });

// Create React root
const root = createRoot(document.getElementById("root"));

// Correct wrapping: Provider first, PersistGate inside
root.render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <ReactRoot />
    </PersistGate>
  </Provider>
);
