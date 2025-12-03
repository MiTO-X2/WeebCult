/***********************************************************************
 * PURPOSE:
 *   - Handles login/logout logic for Firebase
 *   - Presenter connects Firebase auth events → Redux userSlice
 * 
 * RESPONSIBILITIES:
 *   - Connect Redux auth state → pass to AuthView
 *   - Trigger login() and logout() via Firebase + authSlice thunks
 *   - Redirect after successful login
 *
 * RULES:
 *   - No JSX except <AuthView ... />
 *   - No CSS
 *   - No direct Firebase calls (use userSlice thunks)
 *   - No storing state here (use Redux)
 *
 * NEED TO DO:
 *   1. import AuthView
 *   2. import useDispatch, useSelector
 *   3. import loginThunk, logoutThunk from userSlice
 *   4. import useNavigate from react-router-dom
 *   5. Read state.auth.user
 *   6. Create callbacks:
 *        loginACB()  → dispatch(loginThunk())
 *        logoutACB() → dispatch(logoutThunk())
 *   7. If user exists → navigate("/") 
 *   8. Return <AuthView ... />
 ***********************************************************************/

import { connect } from "react-redux";
import { AuthView } from "../views/authView";

export function AuthPresenter() {

    // TODO: get dispatch()
    // TODO: get navigate()
    // TODO: read user from Redux (state.auth.user)

    // TODO: define loginACB() { dispatch(loginThunk()); }
    // TODO: define logoutACB() { dispatch(logoutThunk()); }

    // TODO: if user is logged in → navigate("/")
    
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
