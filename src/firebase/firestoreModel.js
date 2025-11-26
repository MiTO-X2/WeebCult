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

// TODO #1:
// Import Firestore helpers:
// import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

// TODO #2:
// Implement saveUserStats(uid, stats):
//   - Write to /users/{uid}/stats
//   - Use setDoc(..., { merge: true })
//   - Return the Promise
//   - No UI/Redux/business logic here

// TODO #3:
// Implement loadUserStats(uid):
//   - Read /users/{uid}/stats
//   - If missing → return {}
//   - Must return a Promise resolving to a JS object

// TODO #4:
// Implement saveUserSettings(uid, settings):
//   - Write to /users/{uid}/settings
//   - Use setDoc(..., { merge: true })
//   - Must return Promise

// TODO #5:
// All functions must return Promises only.
// NO business logic.
// NO UI logic.
// NO Redux usage.
// NO presenter should import this file — only Redux thunks may call it.