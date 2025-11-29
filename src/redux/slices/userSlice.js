/***********************************************************************
 * PURPOSE:
 *   - Manage Firebase user state: uid, profile object
 *   - loginUser = loads profile from Firestore
 *   - logoutUser = clears state + maybe saves stats
 * 
 ***********************************************************************/

// TODO:
// 1. import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { loadUserProfile, saveUserProfile } from '../../models/firestoreModel';
// Placeholder imports for Firestore functions
const loadUserProfile = async (uid) => {
    // Simulate fetching user profile from Firestore
    return { name: "Test User", settings: {} };
};  
const saveUserProfile = async (profile) => {    
    // Simulate saving user profile to Firestore
    return;
};

const initialState = {
    uid: null,
    profile: null,
    loading: false,
    error: null,
};  




