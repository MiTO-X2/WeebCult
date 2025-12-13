/***********************************************************************
 * Responsibilities:
 *   - Listen to Firebase auth changes (login/logout)
 *   - Login (Google) thunk
 *   - Logout thunk
 *   - Update Redux user state and ready flag
 ***********************************************************************/

import { onAuthStateChanged } from "firebase/auth";
import { setUid, clearUser, setUserData, fetchUserStats, setReady } from "/src/redux/slices/userSlice";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, login, logout } from '/src/firebase/firestoreModel.js';

/***********************************************************************
 * Listen to Firebase auth changes (fires once at startup + on login/logout)
 ***********************************************************************/
export const listenToAuthChangesThunk = () => (dispatch) => {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // User logged out → clear entire user state
            dispatch(clearUser());
            dispatch(setReady(true)); // ready, but no user logged in
            return;
        }

        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            const newData = { createdAt: Date.now() };
            await setDoc(ref, newData);
            dispatch(setUserData(newData));
        } else {
            dispatch(setUserData(snap.data()));
        }

        dispatch(setUid(user.uid));
        dispatch(fetchUserStats(user.uid)); // load user stats
        dispatch(setReady(true)); // ready flag for UI
    });
};

/***********************************************************************
 * Login thunk (Google)
 ***********************************************************************/
export const loginUserThunk = () => async (dispatch) => {
    try {
        const userCredential = await login(); // Firebase Google login
        const uid = userCredential.user.uid;
        dispatch(setUid(uid));
        dispatch(fetchUserStats(uid)); // load user stats from Firestore
        dispatch(setReady(true));      // app is ready after login
    } catch (err) {
        console.error("Login error:", err);
    }
};

/***********************************************************************
 * Logout thunk
 ***********************************************************************/
export const logoutUserThunk = () => async (dispatch) => {
    try {
        await logout(); // Firebase logout
        dispatch(clearUser());
        dispatch(setReady(true)); // app is ready after logout
    } catch (err) {
        console.error("Logout error:", err);
    }
};