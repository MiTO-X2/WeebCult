/***************************************************************
 * PURPOSE:
 *   - Create and export the Redux store using configureStore()
 *   - Add default  middleware (including thunk)
 *   - Import the rootReducer containing all slices
 *  
 *
 * NOTES:
 *   - No business logic here.
 ***************************************************************/

// TODO:
 import { configureStore } from '@reduxjs/toolkit';
 import rootReducer from './rootReducer.js';

// Create and export the Redux store    
 export const store = configureStore({   
       reducer: rootReducer,
       middleware: (getDefault) => getDefault(),
});  
 

//export default store;  

//
// 5. DO NOT create thunks here.
// 6. DO NOT fetch APIs here.
