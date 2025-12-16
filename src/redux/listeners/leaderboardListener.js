import { createListenerMiddleware } from '@reduxjs/toolkit';
import { openLeaderboard, fetchLeaderboard, fetchUserLeaderboardEntry } from '../slices/leaderboardSlice';

export const leaderboardListener = createListenerMiddleware();

leaderboardListener.startListening({
    actionCreator: openLeaderboard,
    effect: async (action, listenerApi) => {
        const state = listenerApi.getState();
        const uid = state.user.uid;

        // Fetch global leaderboard
        listenerApi.dispatch(fetchLeaderboard());

        // Fetch user leaderboard entry if we have UID
        if (uid) listenerApi.dispatch(fetchUserLeaderboardEntry(uid));
    }
});
