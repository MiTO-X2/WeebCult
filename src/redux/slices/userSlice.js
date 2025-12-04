/***********************************************************************
 * PURPOSE:
 * Central Redux auth slice (Firebase Authentication + Firestore user data)
 * 
 *   - Manage Firebase user state: uid, profile object
 *   - Stores logged-in user's UID and profile document
 *   - loginUser() = sign-in detected → load Firestore profile
 *   - logoutUser() = sign-out detected → clear state
 *   - saveUserProfile() = update profile in Firestore
 * 
 ***********************************************************************/

// TODO:
// 1. import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// 2. Import firestoreModel functions:
//       loadUserStats, saveUserStats, loadUserSettings, etc.
//    import { auth } from "../firebase/firebaseConfig";
//    import { onAuthStateChanged } from "firebase/auth";
//
// 3. Define initialState:
//       { uid: null, profile: null, loading: false, error: null }
//
// 4. Define thunks:
//    Thunk: loginUser(uid):
//           - fetch Firestore user profile
//           - return { uid, profile }
//
//       export const loginUser = createAsyncThunk(
//         "user/loginUser",
//         async (uid) => {
//             const profile = await loadUserProfile(uid);
//             return { uid, profile };
//         }
//       );
//
//    Thunk: logoutUser():
//           - clear Redux state, maybe save stats
//
//           export const logoutUser = createAsyncThunk(
//             "user/logoutUser",
//             async () => {
//               return true;  // nothing async needed
//             }
//           );
//
//    Thunk: saveUserProfile(profile):
//           - write the profile to Firestore
//
//           export const saveUserProfile = createAsyncThunk(
//             "user/saveUserProfile",
//             async (profile, { getState }) => {
//                const uid = getState().user.uid;
//                await saveUserProfileToDB(uid, profile);
//                return profile;
//             }
//           );
//
// 5. createSlice({
//       name: 'user',
//       initialState,
//       reducers: {
//             // If something needs manual reset
//             clearUser(state) {
//                 state.uid = null;
//                 state.profile = null;
//             }
//       }
//     })
//
// 6. Export actions & reducer
//    export const { clearUser } = userSlice.actions;
//    export userSlice.reducer;

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

 /************************ 5. createSlice *****************/

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {//       logout(state) { clear uid + profile }
        logout(state) {//   
            // clear uid + profile
            state.uid = null;// clear uid
            state.profile = null;// clear user data
        },

    },
    extraReducers:(builder) =>{

        // Hantera loginUser() load profile and uid
        builder 
            .addCase(loginUser.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state,action)=>{//Osäker hur man kommer åt profile och uid
                state.loading = false;
                state.profile = action.payload.profile;
                state.uid = action.payload.uid ;
            })
            .addCase(loginUser.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.error;
            });

        // Hantera saveUserProfileThunk()
        builder
            .addCase(saveUserProfileThunk.pending, (state)=>{
                state.loading = true;
                state.error = null;

            })
            .addCase(saveUserProfileThunk.fulfilled, (state, action)=>{
                state.loading = false;
                state.profile = action.payload;
                
            })
            .addCase(saveUserProfileThunk.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.error;
                
            })

    }
})
export default userSlice.reducer
  
            



