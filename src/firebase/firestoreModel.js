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
import { getFirestore, doc, setDoc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
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


function saveUserStats(uid,stats){

    if (model.ready && model.user){
        const userRef = doc(db, "users", uid)
        stats: {quizzes: [{score,total,category,mode,type,time,completedAt,animeId}]}
        return setDoc( userRef, {stats}, {merge: true})
    }
    return 

}

async function loadUserStats(uid){
    if (model.ready && model.user){
        const userRef = doc(db,"users",uid)
        const snap = await getDoc(userRef)

        if(!snap.exists())
            return {quizzes : []};

        return getDoc(userRef)
    }
}

function saveUserSettings(uid,settings){

    if(model.ready && model.user){
        const userRef = doc(db,"users",uid)
        return setDoc(userRef,{settings}, {merge: true})
    }



}

function updateLeaderboardEntry(uid,leaderboardData){

    const ref = doc(db,"leaderboard",uid)

    leaderboardData = {
        username: String,
        bestScore: Number,
        quizzesCompleted: Number,
        lastUpdated: Timestamp
    }
    return setDoc(ref, leaderboardData, {merge: true});


}

async function loadLeaderboard(){

    const snap = await getDoc(doc(db,"leaderboard"));
    
    return Object.values(snap.data);
    // TODO #6: loadLeaderboard, Returns array -> Presenter sorts -> View displays.
// Implement loadLeaderboard():
//   - Read ALL documents from /leaderboard collection
//   - Return array of entries:
//       [{ uid, username, bestScore, quizzesCompleted, lastUpdated }, ...]
//   - Sorting happens in Presenter, NOT here
//   - Must return a Promise resolving to an array
//   - Do NOT include any ranking logic here
}

// TODO #2: saveUserStats
// Implement saveUserStats(uid, stats):
//   - Write to /users/{uid}/stats
//   - stats: { quizzes: [ {score, total, category, mode, type, time, completedAt, animeId, animeTitle, animeImage}, ... ] }
//   - const userRef = doc(db, "users", uid);
//   - Use setDoc(userRef, { stats }, { merge: true })
//   - Return the Promise
//   - No UI/Redux/business logic here
//
//   - After saving stats, Redux thunks are responsible for calling updateLeaderboardEntry()
//   - DO NOT call leaderboard functions from inside saveUserStats (keeps layers clean).

// TODO #3: loadUserStats
// Implement loadUserStats(uid):
//   - Read /users/{uid}/stats
//   - const userRef = doc(db, "users", uid);
//   - const snap = await getDoc(userRef);
//   - If missing -> return {}
//   - if (!snap.exists()) return { quizzes: [] };
//   - Must return a Promise resolving to a JS object
//   - No business logic (sorting, ranking, etc).

// TODO #4: saveUserSettings
// Implement saveUserSettings(uid, settings):
//   - Write to /users/{uid}/settings
//   - const userRef = doc(db, "users", uid);
//   - Use setDoc(userRef, { settings }, { merge: true });
//   - Must return Promise

// TODO #5: updateLeaderboardEntry
// Implement updateLeaderboardEntry(uid, leaderboardData):
//   PURPOSE:
//     - Create/update a user's public leaderboard entry
//     - Stored under /leaderboard/{uid}
//   leaderboardData = {
//       username: string,
//       bestScore: number,
//       quizzesCompleted: number,
//       lastUpdated: timestamp
//   };
//   - const ref = doc(db, "leaderboard", uid);
//   - Use setDoc(ref, leaderboardData, { merge: true });
//   - Must return Promise
//   - NO ranking logic here (ranking is computed by Redux/Presenter)

// TODO #6: loadLeaderboard, Returns array -> Presenter sorts -> View displays.
// Implement loadLeaderboard():
//   - Read ALL documents from /leaderboard collection
//   - Return array of entries:
//       [{ uid, username, bestScore, quizzesCompleted, lastUpdated }, ...]
//   - Sorting happens in Presenter, NOT here
//   - Must return a Promise resolving to an array
//   - Do NOT include any ranking logic here

// TODO #7: loadLeaderboardEntry(uid), Useful for checking if user already has an entry
// OPTIONAL helper:
//   - Read /leaderboard/{uid}
//   - If missing -> return null
//   - Used by Redux if needed to show "Your Rank"

// TODO #8:
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


/**
 * Leaderboard table in the leaderboardView/Presenter must contain:
 *    - Rank (#1, #2, ...)
 *    - Username (Google Auth displayName)
 *    - Best score (highest)
 *    - Total quizzes completed
 * 
 * And below the table:
 *    - Your rank
 *    - Your username
 *    - Your best score
 *    - Your total completed quizzes
 */