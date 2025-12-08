/***********************************************************************
 * PURPOSE:
 *   - Global shared leaderboard state
 *   - Stores all leaderboard entries (not per-user stats)
 *   - Fetch leaderboard collection from Firestore
 *   - Update the logged-in user's leaderboard entry
 *
 * RULES:
 *   - NO business or sorting logic in Firestore model
 *   - Sorting (ranking) is done in Presenter, not here
 *   - View = pure, Presenter = logic, Slice = state
 *
 ***********************************************************************/

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { updateLeaderboardEntry, loadLeaderboard, loadLeaderboardEntry } from "/src/firebase/firestoreModel";


//  Thunks

// --------------------------------------------------------
// Load all leaderboard entries (global)
// --------------------------------------------------------
export const fetchLeaderboard = createAsyncThunk(
    "leaderboard/fetchLeaderboard",
    async (_, { rejectWithValue }) => {
        try {
            const entries = await loadLeaderboard();
            return entries || [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// --------------------------------------------------------
// Load the logged-in user's leaderboard entry
// --------------------------------------------------------
export const fetchUserLeaderboardEntry = createAsyncThunk(
    "leaderboard/fetchUserLeaderboardEntry",
    async (uid, { rejectWithValue }) => {
        try{
            const entry = await loadLeaderboardEntry(uid);
            return entry || null;
        } catch(error){
            return rejectWithValue(error.message);
        }
    }
);

// --------------------------------------------------------
// Update logged-in user's leaderboard entry
//
// Called after a user finishes a quiz:
//
// leaderboardData:
//   {
//      username,
//      bestScore,
//      quizzesCompleted,
//      lastUpdated
//   }
// --------------------------------------------------------
export const saveUserLeaderboardEntry = createAsyncThunk(
    "leaderboard/saveUserLeaderboardEntry",
    async ({ uid, leaderboardData }, { rejectWithValue }) => {
        try {
            await updateLeaderboardEntry(uid, leaderboardData);
            return { uid, ...leaderboardData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// ====================================================================
//  Slice
// ====================================================================

const initialState = {
    entries: [],          // global leaderboard array
    userEntry: null,      // logged-in user's leaderboard info
    loading: false,
    error: null,
};

export const leaderboardSlice = createSlice({
    name: "leaderboard",
    initialState,
    reducers: {
        // Optional: reset leaderboard (rarely used)
        clearLeaderboard(state){
            state.entries = [];
            state.userEntry = null;
            state.loading = false;
            state.error = null;
        }
    },

    extraReducers: (builder) => {

        // -------------------------------
        // fetchLeaderboard
        // -------------------------------
        builder
            .addCase(fetchLeaderboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                state.loading = false;
                state.entries = action.payload;
            })
            .addCase(fetchLeaderboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // -------------------------------
        // fetchUserLeaderboardEntry
        // -------------------------------
        builder
            .addCase(fetchUserLeaderboardEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserLeaderboardEntry.fulfilled, (state, action) => {
                state.loading = false;
                state.userEntry = action.payload;
            })
            .addCase(fetchUserLeaderboardEntry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // -------------------------------
        // saveUserLeaderboardEntry
        // -------------------------------
        builder
            .addCase(saveUserLeaderboardEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveUserLeaderboardEntry.fulfilled, (state, action) => {
                state.loading = false;
                state.userEntry = action.payload;  // update userEntry
            })
            .addCase(saveUserLeaderboardEntry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
