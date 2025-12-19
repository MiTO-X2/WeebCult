/***********************************************************************
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
                    className="sidebar-button tooltip tooltip-left"
                    data-tooltip="View your 3 most recent quizzes"
                    onClick={() => props.onOpenSidebar()}
                >
                    <i className="fa-solid fa-angles-left"></i>
                </button>

                <button
                    className="leaderboard-button tooltip tooltip-left"
                    data-tooltip="Open the global leaderboard"
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
                        {props.searchResults.map((a, index) => (
                            <div
                                key={`${a.id}-${index}`}
                                className="row-item"
                                onClick={() => onAnimeSelectViewACB(a)}
                            >
                                <img src={a.image} alt={a.title} className="row-item-img" />
                                <p className="row-item-title">{a.title}</p>

                                <div className="row-item-meta">
                                    {a.type && <span className="meta-pill meta-type">{a.type}</span>}
                                    {a.year && <span className="meta-pill meta-year">{a.year}</span>}
                                    {a.rating && <span className="meta-pill meta-rating">{a.rating}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* Welcome banner (only when not searching) */}
                    {!props.searchResults?.length && (
                        <div className="welcome-banner">
                            <h1 className="welcome-title">Welcome to WeebCult</h1>
                            <p className="welcome-text">
                                Discover anime, test your knowledge through quizzes,
                                and compete for a spot on the global leaderboard.
                            </p>
                        </div>
                    )}

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
