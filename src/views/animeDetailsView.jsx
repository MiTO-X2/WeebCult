/***********************************************************************
 * Pure UI modal popup for choosing:
 *   - Category (character name OR role)
 *   - Mode (Solo OR 1v1)
 *   - Type (Best of 10|25 OR Best of 10|25 Timed)
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

    function handleOnPlayACB() {
        if (!props.quizSettings.category || !props.quizSettings.mode || !props.quizSettings.type) {
            alert("Please select category, mode, and type before playing!");
            return;
        }

        props.onPlay();
        window.location.href = "#/game";
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
                        {["Name", "Role", "VoiceActor"].map(value => 
                            renderOptionCB(value, props.quizSettings.category, props.onSelectCategory, "category")
                        )}
                    </div>

                    {/* MODE */}
                    <div className="details-column">
                        <h4 className="details-heading">Mode</h4>
                        {["Solo", "1v1"].map(value => 
                            renderOptionCB(value, props.quizSettings.mode, props.onSelectMode, "mode")
                        )}
                    </div>

                    {/* TYPE */}
                    <div className="details-column">
                        <h4 className="details-heading">Type</h4>
                        {["Best10", "Best10 Timed", "Best25", "Best25 Timed"].map(value =>
                            renderOptionCB(value, props.quizSettings.type, props.onSelectType, "type")
                        )}
                    </div>
                </div>

                {/* PLAY BUTTON */}
                <div className="play-button-container">
                    <button className="play-button" onClick={handleOnPlayACB}>Play</button>
                </div>

            </div>
        </div>
    );

    function renderOptionCB(value, selectedValue, onSelect, groupName) {
        return (
            <label
                key={value}
                className={`radio-option ${selectedValue === value ? "selected" : ""}`}
            >
                <input
                    type="radio"
                    name={groupName}
                    value={value}
                    checked={selectedValue === value}
                    onChange={() => onSelect(value)}
                />
                <span className="radio-label">{value}</span>
            </label>
        );
    }
}
