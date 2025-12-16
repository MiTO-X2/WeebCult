/***********************************************************************
 * PURPOSE:
 *   - Present leaderboard data in a modal popup
 *   - Presenter = Redux-connected container for LeaderboardView
 *   - Fetch leaderboard entries and user's own entry
 *   - Pass all necessary props + callbacks to the view
 *   - Handle suspense / loading states
 *   - Handle modal open/close
 ***********************************************************************/

import { connect } from "react-redux";
import { LeaderboardView } from "../views/leaderboardView.jsx";
import { SuspenseView } from "../views/suspenseView.jsx";
import { closeLeaderboard } from "../redux/slices/leaderboardSlice.js";

// ------------------- mapStateToProps -------------------
function mapStateToProps(state) {
    return {
        leaderboardEntries: state.leaderboard.entries || [],
        userEntry: state.leaderboard.userEntry,
        isOpen: state.leaderboard.isOpen,
        isLoading: state.leaderboard.loading,
        userUid: state.user.uid
    };
}

// ------------------- mapDispatchToProps -------------------
const mapDispatchToProps = {
    onClose: closeLeaderboard
};

// ------------------- Presenter Component -------------------
function LeaderboardPresenterComponent(props) {
    if (!props.isOpen) return null; // modal closed

    if (props.isLoading) return <SuspenseView />;

    // Take top 10
    //const top10 = props.leaderboardEntries.slice(0, 10);

    return (
        <LeaderboardView
            entries={props.leaderboardEntries}
            userEntry={props.userEntry}
            onClose={props.onClose}
        />
    );
}

// ------------------- Connect -------------------
export const LeaderboardPresenter =
    connect(mapStateToProps, mapDispatchToProps)(LeaderboardPresenterComponent);