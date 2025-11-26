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

// TODO:
// 1. Import Firestore utils:
//    - doc(), setDoc(), updateDoc(), getDoc()
//
// 2. Implement saveUserStats(uid, stats):
//    - Write to /users/{uid}/stats
//    - Should overwrite or merge existing stats
//
// 3. Implement loadUserStats(uid):
//    - Read from /users/{uid}/stats
//    - Return {} if document doesn't exist
//
// 4. Implement saveUserSettings(uid, settings):
//    - Write to /users/{uid}/settings
//
// 5. All functions return Promises
//    No business logic, no UI, no Redux inside this file.
//
