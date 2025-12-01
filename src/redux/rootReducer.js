/***************************************************************
 * PURPOSE:
 *   - Combine all slice reducers into a single root reducer.
 * 
 * ARCHITECTURE RULES:
 *   - No logic here
 *   - No side effects
 *   - Only structural combination of slices
 ***************************************************************/

// TODO:
// 1.// Kombinera reducers från olika slices 
import { combineReducers } from '@reduxjs/toolkit';

// 2. Import reducers from the slices:
//       userReducer, uiReducer, animeReducer,
//       detailsReducer, quizReducer
//
import userReducer from './slices/userSlice.js';
//import uiReducer from './slices/uiSlice';
//import animeReducer from './slices/animeSlice';
//import detailsReducer from './slices/detailsSlice';
import quizReducer from './slices/quizSlice.js';   


// 3. 
export default combineReducers({
        user: userReducer,// Kombinera user slice
//        ui: uiReducer,
//        anime: animeReducer,
//        details: detailsReducer,
        quiz: quizReducer,// Lägg till quiz slice
   });

   