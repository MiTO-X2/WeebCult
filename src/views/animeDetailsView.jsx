/***********************************************************************
 * Pure UI modal popup for choosing:
 *   - Category (character name OR age)
 *   - Mode (Solo OR 1v1)
 *   - Type (Best of 10 OR Best of 10 Timed)
 *
 * Requirements:
 *   - Click outside closes popup
 *   - "X" button top-right closes popup
 *   - Title top-left
 *   - 3-column layout of choice groups
 *   - Play button centered
 *   - Background blurred when open
 *
 * All logic is passed in props from the Presenter
 ***********************************************************************/

export function AnimeDetailsView(props) {
    function handleBackgroundClickACB(e) {
        if (e.target.classList.contains("modal-overlay")) {
            props.onClose();
        }
    }

    return (
        <div className="modal-overlay" onClick={handleBackgroundClickACB}>
            <div className="modal-card">

                {/* TITLE */}
                <h2 className="modal-title">
                    <a 
                        href={props.anime.url || `https://myanimelist.net/anime/${props.anime.id}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {props.anime.title}
                    </a>
                </h2>

                {/* CLOSE BUTTON */}
                <button className="modal-close-button" onClick={props.onClose}>✕</button>

                {/* QUIZ SETTINGS */}
                <div className="details-grid">

                    {/* CATEGORY */}
                    <div className="details-column">
                        <h4 className="details-heading">Category</h4>
                        {["name", "age"].map(value => (
                            <div
                                key={value}
                                className={`option-box ${props.quizSettings.category === value ? "selected" : ""}`}
                                onClick={() => props.onSelectCategory(value)}
                            >
                                {value === "name" ? "Character names" : "Character age"}
                            </div>
                        ))}
                    </div>

                    {/* MODE */}
                    <div className="details-column">
                        <h4 className="details-heading">Mode</h4>
                        {["solo", "1v1"].map(value => (
                            <div
                                key={value}
                                className={`option-box ${props.quizSettings.mode === value ? "selected" : ""}`}
                                onClick={() => props.onSelectMode(value)}
                            >
                                {value === "solo" ? "Solo" : "1 v 1"}
                            </div>
                        ))}
                    </div>

                    {/* TYPE */}
                    <div className="details-column">
                        <h4 className="details-heading">Type</h4>
                        {["best10", "timed"].map(value => (
                            <div
                                key={value}
                                className={`option-box ${props.quizSettings.type === value ? "selected" : ""}`}
                                onClick={() => props.onSelectType(value)}
                            >
                                {value === "best10" ? "Best of 10" : "Best of 10 Timed"}
                            </div>
                        ))}
                    </div>
                </div>

                {/* PLAY BUTTON */}
                <div className="play-button-container">
                    <button className="play-button" onClick={props.onPlay}>Play</button>
                </div>

            </div>
        </div>
    );
}
