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
import { selectRecentQuizzes } from "../redux/selectors/quizSelectors.js";

function mapStateToProps(state) {
    return {
        quizzes: selectRecentQuizzes(state),
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