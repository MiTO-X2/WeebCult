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
import { quizListener } from './listeners/quizListener.js'; // <--- import listener

// Load quiz from localStorage
function loadQuizFromLocalStorage() {
  try {
    const serialized = localStorage.getItem('quizState');
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (e) {
    return undefined;
  }
}

const preloadedState = {
  quiz: loadQuizFromLocalStorage()
};

// Create and export the Redux store    
export const store = configureStore({   
      reducer: rootReducer,
      preloadedState,
      middleware: (getDefault) => 
            getDefault()
                  .prepend(listenerMiddleware.middleware)
                  .prepend(detailsListener.middleware)
                  .prepend(leaderboardListener.middleware)
                  .prepend(quizListener.middleware),
}); 
