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
import { SuspenseView } from "../views/suspenseView.jsx";
import { LeaderboardView } from "../views/leaderboardView.jsx";
import { closeLeaderboard } from "../redux/slices/leaderboardSlice.js";
import { selectRankedLeaderboard, selectUserRankedEntry } from "../redux/selectors/leaderboardSelectors.js";

function mapStateToProps(state) {
    return {
        leaderboardEntries: selectRankedLeaderboard(state),      // already sorted + ranked
        userEntry: selectUserRankedEntry(state, state.user.uid), // user's ranked entry
        isOpen: state.leaderboard.isOpen,
        isLoading: state.leaderboard.loading
    };
}

const mapDispatchToProps = {
    onClose: closeLeaderboard
};

function LeaderboardPresenterComponent(props) {
    if (!props.isOpen) return null; // modal closed

    if (props.isLoading) return <SuspenseView />;

    return (
        <LeaderboardView
            entries={props.leaderboardEntries}
            userEntry={props.userEntry}
            onClose={props.onClose}
        />
    );
}

export const LeaderboardPresenter =
    connect(mapStateToProps, mapDispatchToProps)(LeaderboardPresenterComponent);