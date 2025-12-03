// This a placeholder header presenter, used for testing and debugging
import { HeaderView } from "../views/headerView.jsx";
import { auth} from "../firebase/firestoreModel.js";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

export function HeaderPresenter() {

    
    return (
        <HeaderView
            onNavigateHome={() => window.location.href = "/"}
            onProfile={() => window.location.href = "/"}
            onSignIn={signInACB}
        />
    );
    function signInACB(){
        const provider = new GoogleAuthProvider ();
        auth.currentUser? signOut(auth) : signInWithPopup(auth, provider)

    }
}
