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

const initialState = {// 3. Define initialState:
    // { uid: null, profile: null, loading: false, error: null }
    // Placeholder values
    uid: null,
    profile: null,
    loading: false,
    error: null,
};  


// 4. Define thunks:
export const loginUser = createAsyncThunk(// loginUser(uid):
    'user/loginUser',
    async (uid, { rejectWithValue }) => {  //fetch Firestore user profile 
        try {// return { uid, profile }
            const profile = await loadUserProfile(uid);// Placeholder function
            return { uid, profile };
        } catch (error) {
            return rejectWithValue(error.message);// Handle error
        }           
            return { uid, profile };// Placeholder return
    }
);


export const logoutUser = createAsyncThunk(// logoutUser():
    'user/logoutUser',
    async (_, { getState, rejectWithValue }) => { //clear state, maybe save stats   
        try {
            const state = getState();
            const profile = state.user.profile;
            await saveUserProfile(profile);// Placeholder function
            return;
        }   
        catch (error) {
            return rejectWithValue(error.message);// Handle error       
        }
    }
    
);


export const saveUserProfileThunk = createAsyncThunk(// saveUserProfile(profile):
    'user/saveUserProfile',
    async (profile, { rejectWithValue }) => { //write to Firestore  
        try {
            await saveUserProfile(profile);// Placeholder function
            return profile;
        } catch (error) {
            return rejectWithValue(error.message);// Handle error
        }
    }
);

/* 5. createSlice({
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {//       logout(state) { clear uid + profile }
        logout(state) {//   
            // clear uid + profile
            state.uid = null;// clear uid
            state.profile = null;// clear user data
        },
    },

    
    //**********ska fortsättas sedan ***************/
  
            



