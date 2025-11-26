/***********************************************************************
 * Pure UI.
 * 
 * Props:
 *   props.query
 *   props.onQueryChange
 *   props.results        (array)
 *   props.onSelectAnime
 ***********************************************************************/

export function SearchView(props) {

    // TODO:
    // - Render input field with props.query as value
    // - Trigger props.onQueryChange(text)
    // - Trigger props.onSelectAnime(anime) when user clicks an item

    return (
        <div className="search-page">

            <input
                type="text"
                placeholder="Search anime..."
                value={props.query}
                onChange={(e) => props.onQueryChange(e.target.value)}
            />

        </div>
    );
}
