/***********************************************************************
 * PURPOSE:
 *   - Manage sidebar popup logic
 *   - Handle close action
 ***********************************************************************/

import { connect } from "react-redux";
import { SidebarView } from "../views/sidebarView";
import { SuspenseView } from "../views/suspenseView";
import { closeSidebar } from "../redux/slices/sidebarSlice.js";
import { selectRecentQuizzes } from "../redux/selectors/quizSelectors.js";

function mapStateToProps(state) {
    return {
        quizzes: selectRecentQuizzes(state),
        isOpen: state.sidebar.sidebarOpen,

        // neko API state
        neko: state.neko.data,
        nekoPromise: state.neko.promiseState?.promise,
        nekoError: state.neko.promiseState?.error,
    };
}

const mapDispatchToProps = dispatch => ({
    // Close the sidebar 
    onClose: () => dispatch(closeSidebar()),
});
    
function SidebarPresenterComponent(props) {
    if (!props.isOpen) return null;

    if (props.nekoPromise || props.nekoError) {
        return (
            <SuspenseView
                promise={props.nekoPromise}
                error={props.nekoError}
            />
        );
    }
    
    return <SidebarView {...props} />;
}

export const SidebarPresenter =
    connect(mapStateToProps, mapDispatchToProps)(SidebarPresenterComponent);