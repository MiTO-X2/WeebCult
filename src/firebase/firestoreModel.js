/*********************************************************
 * PURPOSE:
 *   - Keep ALL Firestore read/write logic here.
 *   - Used by Redux thunks only.
 *   - React components should NOT call Firestore directly.
 *
 * EXAMPLES:
 *   - saveUserStats(uid, stats)
 *   - loadUserStats(uid)
 *   - saveUserSettings(uid, settings)
 *
 * GOAL:
 *   - Thin wrappers around Firestore collections.
 *   - Always return Promises.
 *********************************************************/


import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import{ firebaseConfig } from "/src/firebase/firebaseConfig.js"
import { getAuth,  onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth"

const app= initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
window.db = db

export function connectToFirebase(model){

    model.ready = false
    onAuthStateChanged(auth,loginOrOutACB);

    async function loginOrOutACB(user) {
        model.user = user;
        model.ready = false;

        if (!user) {
            model.userData = null;
            model.ready = true;
            return;
        }

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
            // create user doc on first login
            await setDoc(userRef, { createdAt: Date.now() });
        }

        model.userData = snap.data();
        model.ready = true;
    }
}

/** LOGIN / LOGOUT **/
export function login() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

export function logout() {
    return signOut(auth);
}

// TODO #2: saveUserStats
// Implement saveUserStats(uid, stats):
//   - Write to /users/{uid}/stats
//   - stats: { quizzes: [ {score, total, category, mode, type, time, completedAt, animeId, animeTitle, animeImage}, ... ] }
//   - const userRef = doc(db, "users", uid);
//   - Use setDoc(userRef, { stats }, { merge: true })
//   - Return the Promise
//   - No UI/Redux/business logic here

// TODO #3: loadUserStats
// Implement loadUserStats(uid):
//   - Read /users/{uid}/stats
//   - const userRef = doc(db, "users", uid);
//   - const snap = await getDoc(userRef);
//   - If missing → return {}
//   - if (!snap.exists()) return { quizzes: [] };
//   - Must return a Promise resolving to a JS object

// TODO #4: saveUserSettings
// Implement saveUserSettings(uid, settings):
//   - Write to /users/{uid}/settings
//   - const userRef = doc(db, "users", uid);
//   - Use setDoc(userRef, { settings }, { merge: true });
//   - Must return Promise

// TODO #5:
// All functions must return Promises only.
// NO business logic.
// NO UI logic.
// NO Redux usage.
// NO presenter should import this file — only Redux thunks may call it.
// | Field         | Description                                    |
// | ------------- | ---------------------------------------------- |
// | `score`       | How many points the user got (e.g., 9)         |
// | `total`       | Total questions in that quiz (e.g., 10)        |
// | `category`    | "Character Name" / "Character Age", etc.       |
// | `mode`        | "solo" / "versus"                              |
// | `type`        | "bestOf10" / "timed"                           |
// | `time`        | Total duration in seconds or formatted string  |
// | `completedAt` | Timestamp for sorting recent quizzes           |
