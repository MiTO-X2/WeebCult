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

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer.js';
import { listenerMiddleware } from "./listeners/listenerMiddleware.js";
import { detailsListener } from "./listeners/detailsListener.js";
import { leaderboardListener } from "./listeners/leaderboardListener.js";

// Create and export the Redux store    
export const store = configureStore({   
      reducer: rootReducer,
      middleware: (getDefault) => 
      getDefault().prepend(listenerMiddleware.middleware).prepend(detailsListener.middleware).prepend(leaderboardListener.middleware),
}); 
