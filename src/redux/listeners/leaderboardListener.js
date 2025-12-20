import { createListenerMiddleware } from '@reduxjs/toolkit';
import {
  openLeaderboard,
  setLeaderboard,
  setUserLeaderboardEntry,
  setLeaderboardError,
  setLoading,
  saveUserLeaderboardEntryAction
} from "../slices/leaderboardSlice";
import {
  loadLeaderboard,
  loadLeaderboardEntry,
  updateLeaderboardEntry
} from "/src/firebase/firestoreModel";

export const leaderboardListener = createListenerMiddleware();

// --------------------------
// Load leaderboard when opened
// --------------------------
leaderboardListener.startListening({
  actionCreator: openLeaderboard,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(setLoading(true));

    try {
      // Load global leaderboard
      const entries = await loadLeaderboard();
      listenerApi.dispatch(setLeaderboard(entries));

      // Load user's entry if logged in
      const state = listenerApi.getState();
      const uid = state.user?.uid;
      if (uid) {
        const userEntry = await loadLeaderboardEntry(uid);
        listenerApi.dispatch(setUserLeaderboardEntry(userEntry));
      }
    } catch (err) {
      listenerApi.dispatch(setLeaderboardError(err.message));
      console.error("Failed to load leaderboard:", err);
    } finally {
      listenerApi.dispatch(setLoading(false));
    }
  }
});

// --------------------------
// Save user's leaderboard entry
// --------------------------
leaderboardListener.startListening({
  actionCreator: saveUserLeaderboardEntryAction,
  effect: async (action, listenerApi) => {
    const { uid, data } = action.payload;
    listenerApi.dispatch(setLoading(true));
    try {
      await updateLeaderboardEntry(uid, data);
      listenerApi.dispatch(setUserLeaderboardEntry(data));
    } catch (err) {
      listenerApi.dispatch(setLeaderboardError(err.message));
      console.error("Failed to persist leaderboard entry:", err);
    } finally {
      listenerApi.dispatch(setLoading(false));
    }
  }
});
