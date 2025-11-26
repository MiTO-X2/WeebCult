/***********************************************************************
 * PURPOSE:
 *   - Manage Firebase user state: uid, profile object
 *   - Expose login/logout reducers
 *   - Async thunks load/save user data using firestoreModel.js
 * 
 ***********************************************************************/

// TODO:
// 1. Import createSlice, createAsyncThunk
// 2. Import firestoreModel functions:
//       loadUserStats, saveUserStats, loadUserSettings, etc.
// 3. Define initialState:
//       { uid: null, profile: null, loading: false, error: null }
//
// 4. Define thunks:
//       loginUser(uid):
//           - fetch Firestore user profile
//           - return { uid, profile }
//
//       logoutUser():
//           - clear state, maybe save stats
//
//       saveUserProfile(profile):
//           - write to Firestore
//
// 5. createSlice({
//       name: 'user',
//       reducers: {
//         logout(state) { clear uid + profile }
//       }
//    })
//
// 6. Export actions & reducer
