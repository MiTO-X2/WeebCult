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
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import{ firebaseConfig } from "/src/firebase/firebaseConfig.js"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth"

const app= initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export async function loadUserProfile(uid) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        const newData = { createdAt: Date.now() };
        await setDoc(ref, newData);
        return newData;
    }

    return snap.data();
}

/** LOGIN / LOGOUT **/
export function login() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

export function logout() {
    return signOut(auth);
}

/***************************************************
 * USERS: SAVE STATS
 * stats = { quizzes: [ ... ] }
 ***************************************************/
export function saveUserStats(uid,stats){
    const userRef = doc(db, "users", uid)
    return setDoc( userRef, {stats}, {merge: true});
}

/***************************************************
 * USERS: LOAD STATS
 ***************************************************/
export async function loadUserStats(uid){
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return { quizzes: [] };

    return snap.data().stats || { quizzes: [] };
}

/***************************************************
 * USERS: SAVE SETTINGS
 ***************************************************/
export function saveUserSettings(uid,settings){
    const userRef = doc(db, "users", uid);
    return setDoc(userRef, { settings }, { merge: true });
}

/***************************************************
 * LEADERBOARD: UPDATE ENTRY
 ***************************************************/
export function updateLeaderboardEntry(uid,leaderboardData){
    const ref = doc(db, "leaderboard", uid);
    return setDoc(ref, leaderboardData, { merge: true });
}

/***************************************************
 * LEADERBOARD: LOAD ALL ENTRIES
 ***************************************************/
export async function loadLeaderboard(){
    const snap = await getDocs(collection(db,"leaderboard"));

    return snap.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
    }));
}

/***************************************************
 * LEADERBOARD: LOAD SINGLE USER ENTRY
 ***************************************************/
export async function loadLeaderboardEntry(uid){
    const ref = doc(db, "leaderboard", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return snap.data();
}