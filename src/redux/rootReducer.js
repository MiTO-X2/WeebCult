/***************************************************************
 * PURPOSE:
 *   - Combine all slice reducers into a single root reducer.
 * 
 * ARCHITECTURE RULES:
 *   - No logic here
 *   - No side effects
 *   - Only structural combination of slices
 ***************************************************************/

import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';
import animeReducer from './slices/animeSlice.js';
import detailsReducer from './slices/detailsSlice.js';
import quizReducer from './slices/quizSlice.js';  
import sidebarReducer from './slices/sidebarSlice.js';  
import nekoReducer from './slices/nekoSlice.js';  
import leaderboardReducer from './slices/leaderboardSlice.js';

// Combine reducers into a single root reducer
export default combineReducers({
        user: userReducer,       // User authentication, profile, tokens
        anime: animeReducer,     // Anime lists, genres, filters
        details: detailsReducer, // Detailed view data
        quiz: quizReducer,       // Quiz system state
        sidebar: sidebarReducer,
        neko: nekoReducer,
        leaderboard: leaderboardReducer
   });