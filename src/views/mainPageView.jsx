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

    return (
        <div className="main-page">

            {/* Top-right buttons: sidebar + leaderboard */}
            <div className="top-buttons">
                <button 
                    className="sidebar-button"
                    onClick={() => props.onOpenSidebar()}
                >
                    <i className="fa-solid fa-angles-left"></i>
                </button>

                <button
                    className="leaderboard-button"
                    onClick={props.onOpenLeaderboard}
                >
                    <i className="fa-solid fa-trophy"></i>
                </button>
            </div>

            {/* Main content */}
            {props.searchResults?.length > 0 ? (
                <div className="row-container">
                    <h2 className="row-title">Search Results</h2>
                    <div className="search-results-grid">
                        {props.searchResults.map((a) => (
                            <div
                                key={a.id}
                                className="row-item"
                                onClick={() => onAnimeSelectViewACB(a)}
                            >
                                <img src={a.image} alt={a.title} className="row-item-img" />
                                <p className="row-item-title">{a.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {props.trending?.length > 0 && (
                        <RowView
                            title="Trending"
                            items={props.trending}
                            onSelectItem={onAnimeSelectViewACB}
                        />
                    )}
                    {props.genres?.map((g) => (
                        <RowView
                            key={g.label}
                            title={g.label}
                            items={g.items}
                            onSelectItem={onAnimeSelectViewACB}
                        />
                    ))}
                </>
            )}

        </div>
    );
}
