/***********************************************************************
 * PURPOSE:
 *   - Handles login/logout logic for Firebase
 *   - Presenter connects Firebase auth events → Redux userSlice
 ***********************************************************************/

import { connect } from "react-redux";
import { AuthView } from "../views/authView";

export function AuthPresenter() {

    // TODO (Redux-based presenter):
    //
    // 1. mapStateToProps(state):
    //        - profile = state.user.profile
    //
    // 2. mapDispatchToProps(dispatch):
    //        - loginWithGoogle(): dispatch(startGoogleLoginThunk())
    //        - logout(): dispatch(logoutThunk())
    //
    // 3. Presenter logic (component-like container):
    //        - In mergeProps or a wrapper component, attach onAuthStateChanged listener
    //        - When Firebase emits a user → dispatch(loginUser(uid))
    //        - When user logs out → dispatch(logout())
    //
    // 4. Pass final props to AuthView:
    //        <AuthView
    //           user={profile}
    //           onLogin={loginWithGoogle}
    //           onLogout={logout}
    //         />
    //
    // Export using connect()
}
