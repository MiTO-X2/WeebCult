/***********************************************************************
 * User listener: persist updated stats to Firestore
 ***********************************************************************/
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { updateUserStatsAction } from '../slices/userSlice';
import { saveUserStats } from '/src/firebase/firestoreModel';

export const userListener = createListenerMiddleware();

userListener.startListening({
  actionCreator: updateUserStatsAction,
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState();
    const uid = state.user.uid;
    if (!uid) return;

    try {
        await saveUserStats(uid, state.user.stats);
        console.log("User stats persisted to Firestore!");
    } catch (err) {
        console.error("Failed to persist user stats:", err);
    }
  }
});
