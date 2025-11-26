/***********************************************************************
 * Pure UI.
 * Renders:
 *   - Trending row
 *   - Categories/Genres row
 * Props:
 *   props.trending  (array)
 *   props.genres    (array)
 ***********************************************************************/

export function MainPageView(props) {

    // TODO:
    // - Call a RowView for trending anime
    // - Call a RowView for genres
    // - Trigger props.onSelectAnime(item)
    // - Trigger props.onSelectGenre(item)
    // - NO side effects

    return (
        <div className="main-page">

            <RowView // maybe ?????
                title="Trending Anime"
                items={props.trending}
                onSelectItem={props.onSelectAnime}
            />

            <RowView
                title="Genres"
                items={props.genres}
                onSelectItem={props.onSelectGenre}
            />

        </div>
    );
}