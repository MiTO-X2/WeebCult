/***********************************************************************
 * Pure UI.
 * Renders:
 *   - Trending row
 *   - Categories/Genres row
 ***********************************************************************/

export function MainPageView({ trending, genres, onSelectAnime, onSelectGenre }) {

    // TODO:
    // Render header + two rows (or more later)
    // Maybe could implement RowView.jsx which handles scrolling for each row

    return (
        <div className="main-page">

            {/* Trending list */}
            <RowView // (perhaps???)
                title="Trending Anime"
                items={trending}
                onSelectItem={onSelectAnime}
            />

            {/* Genres list */}
            <RowView
                title="Genres"
                items={genres}
                onSelectItem={onSelectGenre}
            />

        </div>
    );
}
