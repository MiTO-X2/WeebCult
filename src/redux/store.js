/***************************************************************
 * PURPOSE:
 *   - Create and export the Redux store using configureStore()
 *   - Add default  middleware (including thunk)
 *   - Import the rootReducer containing all slices
 *  
 *
 * NOTES:
 *   - No business logic here.
 *   - DO NOT create thunks here.
 *   - DO NOT fetch APIs here.
 ***************************************************************/

// Import configureStore and root reducer
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer.js';
import { listenerMiddleware } from "./listeners/listenerMiddleware.js";
import { detailsListener } from "./listeners/detailsListener.js";
import { leaderboardListener } from "./listeners/leaderboardListener.js";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

/**
 * redux-persist configuration
 * - Persist anime data + cache timestamps
 * - Do NOT persist appInitialized
 */
const persistConfig = {
  key: "root",
  storage,

  whitelist: ["anime"],

  transforms: [
    {
      in: (state) => ({
        ...state,
        appInitialized: false
      }),
      out: (state) => state
    }
  ]
};

// Adds persistance in the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create and export the Redux store    
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false
    })
      .prepend(listenerMiddleware.middleware)
      .prepend(detailsListener.middleware)
      .prepend(leaderboardListener.middleware)
});

export const persistor = persistStore(store);

