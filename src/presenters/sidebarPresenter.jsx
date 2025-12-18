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
import { fetchRandomNeko } from "../redux/thunks/nekoThunks";
import { useEffect } from "react";

function mapStateToProps(state) {
    return {
        quizzes: selectRecentQuizzes(state),
        isOpen: state.sidebar.sidebarOpen,

        // neko state
        nekoData: state.neko.data,
        nekoStatus: state.neko.status,
        nekoError: state.neko.error,
    };
}

const mapDispatchToProps = dispatch => ({
    // Close the sidebar 
    onClose: () => dispatch(closeSidebar()),
    fetchNeko: () => dispatch(fetchRandomNeko()),
});
    
function SidebarPresenterComponent(props) {
    useEffect(() => {
        if (props.isOpen && props.nekoStatus === "idle") {
            props.fetchNeko();
        }
    }, [props.isOpen, props.nekoStatus, props.fetchNeko]);

    if (!props.isOpen) return null;

    return <SidebarView {...props} />;
}

export const SidebarPresenter =
    connect(mapStateToProps, mapDispatchToProps)(SidebarPresenterComponent);