/***********************************************************************
 * PURPOSE:
 *   - Global shared leaderboard state
 *   - Stores all leaderboard entries (not per-user stats)
 *   - Pure slice: no Firestore calls
 ***********************************************************************/

import { createSlice, createAction } from "@reduxjs/toolkit";

const initialState = {
    entries: [],          // global leaderboard array
    userEntry: null,      // logged-in user's leaderboard info
    loading: false,
    error: null,
    isOpen: false
};

export const saveUserLeaderboardEntryAction = createAction(
  "leaderboard/saveUserLeaderboardEntryAction"
);

/************************************************************
* Slice
************************************************************/
export const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    openLeaderboard(state) {
      state.isOpen = true;
    },
    closeLeaderboard(state) {
      state.isOpen = false;
    },
    setLeaderboard(state, action) {
      state.entries = action.payload;
    },
    setUserLeaderboardEntry(state, action) {
      state.userEntry = action.payload;
    },
    setLeaderboardError(state, action) {
      state.error = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    }
  }
});

export const {
  openLeaderboard,
  closeLeaderboard,
  setLeaderboard,
  setUserLeaderboardEntry,
  setLeaderboardError,
  setLoading
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;