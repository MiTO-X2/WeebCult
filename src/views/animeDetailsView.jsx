/***********************************************************************
 * Pure UI.
 * Renders:
 *   - Anime details inside Modal
 *   - Mode select buttons (e.g., "Quiz", "Characters", etc.)
 *   - "Play" button to start quiz/game
 ***********************************************************************/

export function AnimeDetailsView({ anime, characters, onClose, onPlay }) {

    // TODO:
    // - Show poster, title, synopsis
    // - Buttons to choose mode

    return (
        <modal onClose={onClose}>
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

                <button onClick={onPlay}>Play Quiz</button>

            </div>
        </modal>
    );
}
