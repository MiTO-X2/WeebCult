/***********************************************************************
 * User slice: manage Firebase auth + Firestore user state
 ***********************************************************************/

import { createSlice, createAction } from '@reduxjs/toolkit';

// Action to trigger persistence (listener/side-effect will handle Firestore)
export const updateUserStatsAction = createAction('user/updateUserStatsAction');

const initialState = {
    uid: undefined,
    userData: undefined,   // Firestore “users/{uid}” document
    stats: { 
        quizzes: [], 
        totalQuizzesCompleted: 0,
        totalPoints: 0 }, // Array of completed quizzes
    loading: false,
    error: null,
    ready: false,      // Firebase auth listener sets this
};  

/************************ createSlice *****************/
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Set UID on login, called when Firebase auth fires login
        setUid(state, action) {
            state.uid = action.payload;
        },
        // Reset everything on logout, called when Firebase auth fires logout
        clearUser(state) {
            state.uid = null;
            state.userData = null;
            state.stats = { quizzes: [], totalQuizzesCompleted: 0 };
            state.loading = false;
            state.error = null;
            state.ready = true;
        },
        setUserData(state, action) {
            state.userData = action.payload;
        },
        setReady(state, action) {
            state.ready = action.payload;
        },
        setStatsFromDB(state, action) {
            // Load stats from Firestore without triggering persistence
            state.stats = {
                quizzes: action.payload.quizzes || [],
                totalQuizzesCompleted: action.payload.totalQuizzesCompleted || 0,
                totalPoints: action.payload.totalPoints || 0
            };
        },
        // Add a new completed quiz to stats (local only; call updateUserStats to persist)
        addQuizResult(state, action) {
            const newQuiz = action.payload;

            // Increment total completed quizzes
            if (!state.stats.totalQuizzesCompleted) state.stats.totalQuizzesCompleted = 0;
            state.stats.totalQuizzesCompleted += 1;

            // Add to total points
            state.stats.totalPoints += newQuiz.score;

            const quizzes = state.stats.quizzes || [];

            if (quizzes.length === 0) {
                // First quiz -> just add it
                state.stats.quizzes = [newQuiz];
                return;
            }

            // Find current highest score quiz
            let highestQuiz = quizzes[0];
            let restQuizzes = quizzes.slice(1); // remaining 9 (or fewer)

            // If the new quiz beats the current highest, it becomes index 0
            if (newQuiz.score > highestQuiz.score) {
                state.stats.quizzes = [newQuiz, highestQuiz, ...restQuizzes].slice(0, 10);
            } else {
                // Otherwise, just insert it among the rest (after highest)
                restQuizzes.unshift(newQuiz);
                state.stats.quizzes = [highestQuiz, ...restQuizzes].slice(0, 10);
            }
        }
    }
});

export const { setUid, clearUser, setUserData, setReady, setStatsFromDB, addQuizResult } = userSlice.actions;
export default userSlice.reducer;
  