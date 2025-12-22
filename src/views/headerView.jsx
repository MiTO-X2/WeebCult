/***********************************************************************
 * Contains:
 *  - Logo + Title "WeebCult" -> navigate to home
 *  - Search input + button -> triggers props callbacks
 *  - Image-based anime search with multiple alternatives (TraceMoe)
 *  - Profile button -> go to auth page
 *
 * RULES:
 *  - No data fetching
 *  - No business logic
 *  - No reducers / no model access
 *  - Only calls the functions passed in props
 ***********************************************************************/

import "../style.css";
import WeebCultLogo from "../WeebCultLogo.png";
import { useState, useEffect } from "react";

export function HeaderView(props) {

    /* ---------- Local UI state ---------- */
    const [isTraceMoeOpen, setIsTraceMoeOpen] = useState(false);
    const [traceMoeImageUrl, setTraceMoeImageUrl] = useState("");
    const [traceMoeIndex, setTraceMoeIndex] = useState(0);

    /* Reset index when new results arrive */
    useEffect(() => {
        if (props.traceMoe?.data?.length) {
            setTraceMoeIndex(0);
        }
    }, [props.traceMoe?.data]);

    const currentTraceMoeResult =
        props.traceMoe?.data?.[traceMoeIndex] || null;

    /* ---------- Existing callbacks ---------- */

    function handleNavigateHomeACB() {
        console.log("HeaderView: navigateHomeACB triggered");
        window.location.href = "/";
    }

    function handleQueryChangeACB(event) {
        console.log("HeaderView: queryChangeACB triggered, new query =", event.target.value);
        props.onQueryChange(event.target.value);
    }

    function handleSearchClickACB() {
        console.log("HeaderView: searchACB triggered with query =", props.query);
        props.onSearch();
    }

    function handleProfileClickACB() {
        console.log("Profile button clicked. isLoggedIn =", props.isLoggedIn);

        if (props.isLoggedIn) {
            props.onLogout?.();
        } else {
            props.onLogin?.();
        }
    }

    function handleFilterChangeACB(action, value) {
        action(value);
        props.onSearch();
    }

    /* ---------- TraceMoe UI callbacks ---------- */

    function handleTraceMoeToggleACB() {
        setIsTraceMoeOpen(open => !open);
    }

    function handleTraceMoeImageChangeACB(event) {
        setTraceMoeImageUrl(event.target.value);
    }

    function handleTraceMoeSearchACB() {
        if (!traceMoeImageUrl) return;
        props.onTraceMoeSearch?.(traceMoeImageUrl);
    }

    function handlePrevTraceMoeACB() {
        setTraceMoeIndex(index =>
            index === 0
                ? props.traceMoe.data.length - 1
                : index - 1
        );
    }

    function handleNextTraceMoeACB() {
        setTraceMoeIndex(index =>
            index === props.traceMoe.data.length - 1
                ? 0
                : index + 1
        );
    }

    function handleUseTraceMoeAnimeACB() {
        if (!currentTraceMoeResult) return;

        props.onUseTraceMoeAnime?.(currentTraceMoeResult.filename);
        setTraceMoeImageUrl("");
        setIsTraceMoeOpen(false);
        setTraceMoeIndex(0);
    }

    /* ---------- Render ---------- */

    return (
        <header className="header-bar">

            {/* LEFT: Logo + Title */}
            <div className="header-left" onClick={handleNavigateHomeACB}>
                <img
                    src={WeebCultLogo}
                    alt="WeebCult Logo"
                    className="header-logo"
                />
                <span className="header-title">WeebCult</span>
            </div>

            {/* CENTER: Search + TraceMoe + Filters */}
            <div className="header-center">

                <div className="search-row">
                    <input
                        type="text"
                        placeholder="Search anime..."
                        value={props.query || ""}
                        onChange={handleQueryChangeACB}
                        className="header-search-input"
                    />

                    <button
                        onClick={handleSearchClickACB}
                        className="header-search-button"
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>

                    <button
                        onClick={handleTraceMoeToggleACB}
                        className="traceMoe-button"
                        title="Find anime from image"
                    >
                        🖼
                    </button>
                </div>

                {/* TraceMoe Dropdown */}
                {isTraceMoeOpen && (
                    <div className="traceMoe-dropdown">

                        <p className="traceMoe-title">
                            Paste an image URL to identify the anime
                        </p>

                        <input
                            type="text"
                            placeholder="https://example.com/anime_scene.jpg"
                            value={traceMoeImageUrl}
                            onChange={handleTraceMoeImageChangeACB}
                            className="traceMoe-input"
                        />

                        <button
                            onClick={handleTraceMoeSearchACB}
                            className="traceMoe-search-button"
                        >
                            Detect anime
                        </button>

                        {props.traceMoe?.loading && (
                            <p className="traceMoe-loading">Searching…</p>
                        )}

                        {props.traceMoe?.error && (
                            <p className="traceMoe-error">
                                {props.traceMoe.error}
                            </p>
                        )}

                        {currentTraceMoeResult && (
                            <div className="traceMoe-result">

                                <div className="traceMoe-navigation">
                                    <button onClick={handlePrevTraceMoeACB}>◀</button>
                                    <span>
                                        {traceMoeIndex + 1} / {props.traceMoe.data.length}
                                    </span>
                                    <button onClick={handleNextTraceMoeACB}>▶</button>
                                </div>

                                <img
                                    src={currentTraceMoeResult.image}
                                    alt="Detected anime preview"
                                    className="traceMoe-preview"
                                />

                                <p className="traceMoe-anime-filename">
                                    {currentTraceMoeResult.filename}
                                </p>

                                <p>
                                    Similarity: {(currentTraceMoeResult.similarity * 100).toFixed(1)}%
                                </p>

                                {currentTraceMoeResult.episode !== null && (
                                    <p>Episode: {currentTraceMoeResult.episode}</p>
                                )}

                                <button
                                    onClick={handleUseTraceMoeAnimeACB}
                                    className="traceMoe-use-button"
                                >
                                    Use this anime
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* FILTERS */}
                <div className="search-filters">

                    <select
                        value={props.selectedType || ""}
                        onChange={e =>
                            handleFilterChangeACB(props.onTypeChange, e.target.value)
                        }
                    >
                        <option value="">Type</option>
                        {props.typeOptions?.map(renderOptionCB)}
                    </select>

                    <select
                        value={props.selectedStatus || ""}
                        onChange={e =>
                            handleFilterChangeACB(props.onStatusChange, e.target.value)
                        }
                    >
                        <option value="">Status</option>
                        {props.statusOptions?.map(renderOptionCB)}
                    </select>

                    <select
                        value={props.selectedRating || ""}
                        onChange={e =>
                            handleFilterChangeACB(props.onRatingChange, e.target.value)
                        }
                    >
                        <option value="">Rating</option>
                        {props.ratingOptions?.map(renderOptionCB)}
                    </select>

                    <select
                        value={props.selectedGenres[0] || ""}
                        onChange={e =>
                            handleFilterChangeACB(props.onGenresChange, [e.target.value])
                        }
                    >
                        <option value="">Genre</option>
                        {props.genreOptions?.map(renderGenreCB)}
                    </select>

                    <select
                        value={props.selectedOrderBy || ""}
                        onChange={e =>
                            handleFilterChangeACB(props.onOrderByChange, e.target.value)
                        }
                    >
                        <option value="">Order By</option>
                        {props.orderByOptions?.map(renderOptionCB)}
                    </select>

                </div>
            </div>

            {/* RIGHT: Profile Button */}
            <div className="header-right">
                <button
                    onClick={handleProfileClickACB}
                    className="profile-button"
                >
                    {props.isLoggedIn ? "Logout" : "Login"}
                </button>
            </div>

        </header>
    );

    /* ---------- Render helpers ---------- */

    function renderOptionCB(option) {
        return (
            <option key={option} value={option}>
                {option}
            </option>
        );
    }

    function renderGenreCB(genre) {
        const key = genre.mal_id || genre.name;
        return (
            <option key={key} value={genre.name}>
                {genre.name}
            </option>
        );
    }
}