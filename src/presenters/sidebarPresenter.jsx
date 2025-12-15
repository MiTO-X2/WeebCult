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
import { closeSidebar } from "../redux/slices/sidebarSlice.js";


function mapStateToProps(state) {
    // Ensure we have quizzes array
    const allQuizzes = state.user.stats.quizzes || [];

    // Sort newest first by completedAt (descending)
    const sortedQuizzes = [...allQuizzes].sort((a, b) => b.completedAt - a.completedAt);

    // Take latest 3
    const quizzes = sortedQuizzes.slice(0, 3).map(q => ({
        score: q.score ?? 0,
        total: q.total ?? 0,
        category: q.category ?? "Unknown",
        mode: q.mode ?? "solo",
        type: q.type ?? "best10",
        completedAt: q.completedAt ?? Date.now(),
        animeImg: q.animeImg ?? null
    }));

    return {
        quizzes,
        isOpen: state.sidebar.sidebarOpen,
    };
}


const mapDispatchToProps = dispatch => ({
    // Close the sidebar 
    onClose: () => dispatch(closeSidebar()),
});
    
function SidebarPresenterComponent(props) {
    if (!props.isOpen) return null;

    return <SidebarView {...props} />;
}

export const SidebarPresenter =
    connect(mapStateToProps, mapDispatchToProps)(SidebarPresenterComponent);