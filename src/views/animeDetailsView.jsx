/***********************************************************************
 * Pure UI.
 * Renders:
 *   - Anime details inside Modal
 *   - Props come from AnimeDetailsPresenter ONLY
 *     props.anime
 *     props.characters
 *   
 *   - Mode select buttons (e.g., "Quiz", "Characters", etc.)
 *   - "Play" button to start quiz/game
 ***********************************************************************/

/*export function AnimeDetailsView(props) {

    // TODO (pure UI only):
    // - Show poster, title, synopsis
    // - Render characters list (limit e.g. 8)
    // - Trigger props.onPlay when Play Quiz is clicked
    // - Trigger props.onClose when modal close is clicked
    // - NO data fetching, NO Redux, NO state logic here

    const anime = props.anime;
    const characters = props.characters;

    return (
        <modal onClose={props.onClose}>
            <div className="anime-details">

                <img src={anime.images.jpg.image_url} className="poster" />

                <h2>{anime.title}</h2>

                <p>{anime.synopsis}</p>

                <h3>Characters</h3>
                <ul>
                    {characters?.slice(0, 8).map(c => (
                        <li key={c.character.mal_id}>{c.character.name}</li>
                    ))}
                </ul>

                <button onClick={props.onPlay}>Play Quiz</button>
            </div>
        </modal>
    );
}*/



/***********************************************************************
 * AnimeDetailsView.jsx
 *
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
 * All logic is passed in props from the Presenter:
 *   props.anime
 *   props.characters
 *   props.selectedCategory
 *   props.selectedMode
 *   props.selectedType
 *   props.onSelectCategory(value)
 *   props.onSelectMode(value)
 *   props.onSelectType(value)
 *   props.onPlay()
 *   props.onClose()
 ***********************************************************************/

export function AnimeDetailsView(props) {
    const anime = props.anime;
    const characters = props.characters;

    // If nothing selected, render nothing (modal closed)
    if (!anime) return null;

    function clickBackgroundACB(e) {
        // clicking outside popup closes it
        if (e.target.classList.contains("modal-overlay")) {
            props.onClose();
        }
    }

    return (
        <div className="modal-overlay" onClick={clickBackgroundACB}>
            <div className="modal-card">

                {/* TITLE */}
                <h2 className="modal-title">{anime.title}</h2>

                {/* CLOSE BUTTON */}
                <button className="modal-close-button" onClick={props.onClose}>
                    ✕
                </button>

                {/* OPTIONS GRID */}
                <div className="details-grid">

                    {/* CATEGORY */}
                    <div className="details-column">
                        <h4 className="details-heading">Category</h4>

                        <div
                            className={`option-box ${props.selectedCategory === "name" ? "selected" : ""}`}
                            onClick={() => props.onSelectCategory("name")}
                        >
                            Character names
                        </div>

                        <div
                            className={`option-box ${props.selectedCategory === "age" ? "selected" : ""}`}
                            onClick={() => props.onSelectCategory("age")}
                        >
                            Character age
                        </div>
                    </div>

                    {/* MODE */}
                    <div className="details-column">
                        <h4 className="details-heading">Mode</h4>

                        <div
                            className={`option-box ${props.selectedMode === "solo" ? "selected" : ""}`}
                            onClick={() => props.onSelectMode("solo")}
                        >
                            Solo
                        </div>

                        <div
                            className={`option-box ${props.selectedMode === "1v1" ? "selected" : ""}`}
                            onClick={() => props.onSelectMode("1v1")}
                        >
                            1 v 1
                        </div>
                    </div>

                    {/* TYPE */}
                    <div className="details-column">
                        <h4 className="details-heading">Type</h4>

                        <div
                            className={`option-box ${props.selectedType === "best10" ? "selected" : ""}`}
                            onClick={() => props.onSelectType("best10")}
                        >
                            Best of 10
                        </div>

                        <div
                            className={`option-box ${props.selectedType === "timed" ? "selected" : ""}`}
                            onClick={() => props.onSelectType("timed")}
                        >
                            Best of 10 Timed
                        </div>
                    </div>
                </div>

                {/* PLAY BUTTON */}
                <div className="play-button-container">
                    <button className="play-button" onClick={props.onPlay}>
                        Play
                    </button>
                </div>

            </div>
        </div>
    );
}