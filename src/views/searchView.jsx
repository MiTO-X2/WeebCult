/***********************************************************************
 * Pure UI.
 * Renders:
 *   - Search input field
 *   - Results via RowView or a list of AnimeCards
 ***********************************************************************/

export function SearchView({ query, onQueryChange, results, onSelectAnime }) {

    // TODO:
    // - Input field
    // - Map results → AnimeCard elements
    // - No fetch logic here

    return (
        <div className="search-page">

            <input
                type="text"
                placeholder="Search anime..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
            />

        </div>
    );
}
