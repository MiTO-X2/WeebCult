/***********************************************************************
 * PURPOSE:
 * Central Redux auth slice (Firebase Authentication + Firestore user data)
 * 
 *   - Manage Firebase user state: uid, profile object
 *   - Stores logged-in user's UID and profile document
 *   - loginUser() = sign-in detected → load Firestore profile
 *   - logoutUser() = sign-out detected → clear state
 *   - saveUserProfile() = update profile in Firestore
 * 
 ***********************************************************************/

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadUserStats, saveUserStats } from '/src/firebase/firestoreModel';


const initialState = {
    uid: undefined,
    userData: undefined,   // Firestore “users/{uid}” document
    stats: { quizzes: [] }, // Array of completed quizzes, each quiz: { score, category, mode, type, time, completedAt, animeId, animeTitle, animeImg}
    loading: false,
    error: null,
    ready: false,      // Firebase auth listener sets this
};  

/************* Thunks *************/
// --------------------------------------------------------
// Load stats for a user
// --------------------------------------------------------
export const fetchUserStats = createAsyncThunk(
  "user/fetchUserStats",
  async (uid, { rejectWithValue }) => {
    try {
      const stats = await loadUserStats(uid);
      return stats || { quizzes: [] };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --------------------------------------------------------
// Save stats for a user
// --------------------------------------------------------
export const updateUserStats = createAsyncThunk(
  "user/updateUserStats",
  async (stats, { getState, rejectWithValue }) => {
    const { uid } = getState().user;
    if (!uid) return rejectWithValue("Not logged in");

    try {
      await saveUserStats(uid, stats);
      return stats;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/************************ 5. createSlice *****************/

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
            state.stats = { quizzes: [] };
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
        // Add a new completed quiz to stats (local only; call updateUserStats to persist)
        addQuizResult(state, action) {
            state.stats.quizzes.unshift(action.payload); // newest first
            if (state.stats.quizzes.length > 10) {
                state.stats.quizzes = state.stats.quizzes.slice(0, 10); // keep last 10
            }
        },
    },

    extraReducers:(builder) =>{
        // fetchUserStats
        builder
            .addCase(fetchUserStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchUserStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // updateUserStats
        builder
            .addCase(updateUserStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(updateUserStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    }
})

export const { setUid, clearUser, setUserData, setReady, addQuizResult } = userSlice.actions;
export default userSlice.reducer;
  