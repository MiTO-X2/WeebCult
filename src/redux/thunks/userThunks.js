/***********************************************************************
 * Responsibilities:
 *   - Listen to Firebase auth changes (login/logout)
 *   - Login (Google) thunk
 *   - Logout thunk
 *   - Update Redux user state and ready flag
 ***********************************************************************/

import { onAuthStateChanged } from "firebase/auth";
import { auth, login, logout, loadUserProfile, loadUserStats } from '/src/firebase/firestoreModel.js';
import { setUid, clearUser, setUserData, setReady, setStatsFromDB } from "/src/redux/slices/userSlice";

/***********************************************************************
 * Listen to Firebase auth changes (fires once at startup + on login/logout)
 ***********************************************************************/
export const listenToAuthChangesThunk = () => (dispatch) => {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // User logged out -> clear entire user state
            dispatch(clearUser());
            dispatch(setReady(true)); // ready, but no user logged in
            return;
        }

        const profile = await loadUserProfile(user.uid);
        dispatch(setUserData({
            ...profile,
            displayName: profile.displayName || user.displayName || "Anonymous"
        }));

        dispatch(setUid(user.uid));
        // Load stats directly from Firestore and update Redux
        try {
            const stats = await loadUserStats(user.uid);
            if (stats) {
                dispatch(setStatsFromDB(stats)); // listener middleware persists automatically
            }
        } catch (err) {
            console.error("Failed to load user stats:", err);
        }

        dispatch(setReady(true));
    });
};

/***********************************************************************
 * Login thunk (Google)
 ***********************************************************************/
export const loginUserThunk = () => async () => {
    await login(); // auth listener will handle everything else
};

/***********************************************************************
 * Logout thunk
 ***********************************************************************/
export const logoutUserThunk = () => async () => {
    await logout(); // auth listener clears state
};