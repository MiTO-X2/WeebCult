/***********************************************************************
 * Displays:
 *   - Top 10 leaderboard
 *   - User standing section (rank + stats)
 *   - Behaves like AnimeDetailsView popup
 *
 * PROPS expected:
 *   props.entries       -> array of sorted + ranked entries
 *   props.userEntry     -> single entry of the logged-in user
 *   props.onClose       -> close popup
 *
 * NO business logic here:
 *   - NO sorting here (Presenter does it)
 *   - NO ranking here (Presenter adds rank)
 *   - NO Firestore here
 ***********************************************************************/

export function LeaderboardView(props) {
    
    function handleBackgroundClickACB(e) {
        if (e.target.classList.contains("modal-overlay")) {
            props.onClose();
        }
    }

    return (
        <div className="modal-overlay" onClick={handleBackgroundClickACB}>
            <div className="modal-card leaderboard-card">

                {/* TITLE */}
                <h2 className="modal-title">Leaderboard</h2>

                {/* CLOSE BUTTON */}
                <button className="modal-close-button" onClick={() => props.onClose()}>✕</button>

                {/* TOP 10 TABLE */}
                <div className="leaderboard-table-container">
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Best Score</th>
                                <th>Quizzes</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(props.entries || []).slice(0, 10).map(entry => (
                                <tr key={entry.uid}>
                                    <td>{entry.rank}</td>
                                    <td>{entry.username}</td>
                                    <td>{entry.bestScore}</td>
                                    <td>{entry.quizzesCompleted}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* USER STANDING */}
                {props.userEntry && (
                    <div className="your-standing-container">
                        <h3>Your Standing</h3>

                        {[
                            { label: "Rank", value: props.userEntry.rank },
                            { label: "Username", value: props.userEntry.username },
                            { label: "Best Score", value: props.userEntry.bestScore },
                            { label: "Quizzes Completed", value: props.userEntry.quizzesCompleted }
                        ].map((field) => (
                            <div key={field.label} className="your-standing-row">
                                <span className="your-standing-label">{field.label}:</span>
                                <span className="your-standing-value">{field.value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
