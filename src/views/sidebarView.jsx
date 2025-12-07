/***********************************************************************
 * PURE UI COMPONENT
 * Sidebar popup showing:
 *   - Recent quizzes
 *   - Random anime fact
 *
 * Requirements:
 *   - Click outside closes popup
 *   - Slide-in from right
 *   - Close button
 *   - NO logic, NO Redux, NO Firestore calls
 ***********************************************************************/

export function SidebarView(props) {
    function handleOverlayClickACB(e) {
        if (e.target.classList.contains("sidebar-overlay")) {
            props.onClose();
        }
    }

    return (
        <div className="sidebar-overlay" onClick={handleOverlayClickACB}>
            <div className="sidebar-panel">

                {/* CLOSE BUTTON */}
                <button className="sidebar-close-button" onClick={props.onClose}>✕</button>

                <h2 className="sidebar-title">Recent Quiz Score</h2>

                {/* RECENT QUIZZES */}
                <div className="sidebar-list">
                    {props.quizzes.length === 0 && (
                        <p className="sidebar-empty">No quizzes yet.</p>
                    )}

                    {props.quizzes.map((quiz, index) => (
                        <div key={index} className="quiz-item">

                            <div className="quiz-info">
                                <p><strong>{quiz.score}/{quiz.total}</strong> — {quiz.category}</p>
                                <p>{quiz.mode} | {quiz.type}</p>
                                <p className="quiz-date">
                                    {new Date(quiz.completedAt).toLocaleString()}
                                </p>
                            </div>

                            {quiz.animeImage && (
                                <img className="quiz-thumb" src={quiz.animeImage} alt="" />
                            )}
                        </div>
                    ))}
                </div>

                {/* RANDOM ANIME FACT */}
                <div className="sidebar-fact">
                    {props.loadingFact && <p>Loading random fact...</p>}
                    {!props.loadingFact && props.fact && (
                        <blockquote>
                            <strong>{props.fact.anime}</strong>: {props.fact.fact}
                        </blockquote>
                    )}
                </div>

            </div>
        </div>
    );
}
