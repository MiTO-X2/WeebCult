/***************************************************************
 * PURPOSE:
 *   - Combine all slice reducers into a single root reducer.
 * 
 * ARCHITECTURE RULES:
 *   - No logic here
 *   - No side effects
 *   - Only structural combination of slices
 ***************************************************************/
// 1. Import combineReducers
import { combineReducers } from '@reduxjs/toolkit';

// 2. Import reducers from the slices (NO business logic here)
import userReducer from './slices/userSlice.js';
import animeReducer from './slices/animeSlice.js';
import detailsReducer from './slices/detailsSlice.js';
import quizReducer from './slices/quizSlice.js';   


// 3. Combine reducers into a single root reducer (EXPORT ONLY)
export default combineReducers({
        user: userReducer,       // User authentication, profile, tokens
        anime: animeReducer,     // Anime lists, genres, filters
        details: detailsReducer, // Detailed view data
        quiz: quizReducer,       // Quiz system state
   });

   