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

// Create and export the Redux store    
 export const store = configureStore({   
       reducer: rootReducer,
       // Attach default middleware ONLY (no custom logic)
       middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware),
}); 
