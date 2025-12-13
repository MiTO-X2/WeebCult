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
import { fetchLeaderboard, fetchUserLeaderboardEntry } from "../redux/slices/leaderboardSlice.js";

// ------------------- mapStateToProps -------------------
function mapStateToProps(state) {
    return {
        // TODO: leaderboard entries array
        leaderboardEntries: state.leaderboard.entries,
        // TODO: user's own leaderboard entry
        userEntry: state.leaderboard.userEntry,
        // TODO: modal open state
        isOpen: state.leaderboard.isOpen,
        // TODO: loading state / pending promises
        isLoading: state.leaderboard.loading
    };
}

// ------------------- mapDispatchToProps -------------------
const mapDispatchToProps = {
    // TODO: close leaderboard modal
    onClose: closeLeaderboard,
    // TODO: fetch leaderboard entries
    onfetchLeaderboard: fetchLeaderboard,
    // TODO: fetch user's own leaderboard entry
    fetchUserEntry: fetchUserLeaderboardEntry
};

// ------------------- Presenter Component -------------------
function LeaderboardPresenterComponent(props) {
    if (!props.isOpen) return null; // modal closed

    // TODO: show loader if data is loading
    if (props.isLoading) return <SuspenseView />;

    // TODO: fetch leaderboard data if not already loaded

    return (
        <LeaderboardView
            {...props}
            // props include leaderboardEntries, userEntry, onClose
        />
    );
}

// ------------------- Connect -------------------
export const LeaderboardPresenter =
    connect(mapStateToProps, mapDispatchToProps)(LeaderboardPresenterComponent);