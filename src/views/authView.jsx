/***********************************************************************
 * PURE UI COMPONENT — AUTH VIEW
 *
 * RESPONSIBILITIES:
 *   - Display login screen
 *   - Show a "Login with Google" button if logged out
 *   - Show a "Logout" button if logged in
 *   - Call ONLY props.onLogin / props.onLogout
 *
 * MUST NOT:
 *   - Know anything about Firebase
 *   - Know anything about Redux
 *   - Perform side effects
 *   - Navigate directly
 *
 * PROPS:
 *   props.isLoggedIn  → boolean
 *   props.onLogin()   → called when pressing login
 *   props.onLogout()  → called when pressing logout
 *
 * TODO:
 *   1. Add app logo
 *   2. If props.isLoggedIn == false:
 *         show login button
 *   3. If props.isLoggedIn == true:
 *         show logout button
 *   4. Style using CSS classNames (no inline CSS)
 ***********************************************************************/

export function AuthView(props) {

    // TODO: show logo at top

    return (
        <div className="auth-page">

            {/* TODO: Title: "Welcome to WeebCult" */}

            {/* TODO: If not logged in → show login button */}
            {/* Example:
                <button onClick={props.onLogin}>Login with Google</button>
            */}

            {/* TODO: If logged in → show logout button */}
            {/* Example:
                <button onClick={props.onLogout}>Logout</button>
            */}

        </div>
    );
}
