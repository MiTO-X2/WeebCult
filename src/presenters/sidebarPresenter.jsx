/***********************************************************************
 * PURPOSE:
 *   - Manage sidebar popup logic
 *   - Listen to model/userState and model/factState via Redux
 *   - Pass recent quizzes + random anime fact to SidebarView
 *   - Handle loading state for fact
 *   - Handle close action
 ***********************************************************************/

import { connect } from "react-redux";
import { SidebarView } from "../views/sidebarView";
//import { fetchRandomFact, closeSidebar } from "../redux/slices/factSlice.js";

function mapStateToProps(state) {
    return {
        // Last 10 recent quizzes (already ordered newest-first in reducer)
        quizzes: state.user.stats.quizzes.slice(0, 3),

        // Sidebar open/close flag
        isOpen: state.fact?.isOpen || false, 

        // Placeholders until news from Bogdan
        // Random anime fact 
        fact: state.fact?.factData || null, 
        // Loading state for the random fact
        loadingFact: state.fact?.loading || false
    };
}

const mapDispatchToProps = dispatch => ({
    // Close the sidebar 
    onClose: () => {
        // dispatch(closeSidebar());
        console.warn("Sidebar close dispatched — implement in factSlice later");
    },

    // Fetch a random anime fact (real thunk added later)
    fetchFact: () => {
        // dispatch(fetchRandomFact());
        console.warn("fetchFact() called — implement factSlice thunk later");
    }
});
    
function SidebarPresenterComponent(props) {
    if (!props.isOpen) return null;

    // Fact should load when sidebar opens
    if (!props.fact && !props.loadingFact) {
        props.fetchFact();
    }

    return <SidebarView {...props} />;
}

export const SidebarPresenter =
    connect(mapStateToProps, mapDispatchToProps)(SidebarPresenterComponent);

    // 1. mapStateToProps(state):
    //    - quizzes = state.user.stats.quizzes
    //        * Array of last 10 quizzes, and retrieving the recent 3
    //        * Check the prototype to know what should be included for the quizzes (e.g score, etc)
    //    - fact = state.fact.factData
    //        * Object returned from factSlice: { anime, fact }

    // 2. mapDispatchToProps(dispatch):
    //    - onClose(): function to close sidebar
    //        * Closing is exactly like the animeDetailsView popup, just returns to main page
    //    - fetchFact(): dispatch async thunk from factSlice to get a random anime fact
    //        * Called on sidebar open to load a fact

    // 3. Pass props to SidebarView:
    //        <SidebarView
    //            quizzes={quizzes}
    //            fact={fact}
    //            loadingFact={loadingFact}
    //            onClose={onClose}
    //        />

    // 4. Connect Redux:
    //    - Use connect(mapStateToProps, mapDispatchToProps)(SidebarView)
    //    - Export SidebarPresenter

    // NOTES:
    //    - Do NOT include any UI logic in the presenter
    //    - Do NOT call Firestore or APIs directly; use slices/thunks
    //    - Keep all business logic in the thunks or slices
