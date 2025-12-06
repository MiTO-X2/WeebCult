/***********************************************************************
 * Pure UI.
 * Renders:
 *   - Rows of anime lists (Trending + Genres)
 * Props:
 *   props.trending
 *   props.genres: array of { label, items }
 *   props.onSelectAnime
 ***********************************************************************/

import { RowView } from "./rowView.jsx";

export function MainPageView(props) {

    function onAnimeSelectViewACB(anime) {
        props.onSelectAnime(anime);
    }

    // If search results exist → show them instead of rows
    if (props.searchResults?.length > 0) {
        return (
            <div className="main-page">
                <div className="row-container">
                    <h2 className="row-title">Search Results</h2>
                    <div className="search-results-grid">
                        {props.searchResults.map((a) => (
                            <div
                            key={a.id}
                            className="row-item"
                            onClick={() => props.onSelectAnime(a)}
                            >
                            <img src={a.image} alt={a.title} className="row-item-img" />
                            <p className="row-item-title">{a.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }



    // Otherwise show the normal main page rows
    return (
        <div className="main-page">

            {/* Trending */}
            {props.trending?.length > 0 && (
                <RowView
                    title="Trending"
                    items={props.trending}
                    onSelectItem={onAnimeSelectViewACB}
                />
            )}

            {/* Dynamic list of genre rows */}
            {props.genres?.map((g) => (
                <RowView
                    key={g.label}
                    title={g.label}
                    items={g.items}
                    onSelectItem={onAnimeSelectViewACB}
                />
            ))}

        </div>
    );
}
