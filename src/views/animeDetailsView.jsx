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

export function AnimeDetailsView(props) {

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
}
