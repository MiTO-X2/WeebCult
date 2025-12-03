/***********************************************************************
 * PURE UI COMPONENT
 * 
 * Contains:
 *  - Logo + Title "WeebCult" → navigate to home
 *  - Search input + button → triggers props callbacks
 *  - Profile button → go to auth page
 *
 * RULES:
 *  - No data fetching
 *  - No business logic
 *  - No reducers / no model access
 *  - Only calls the functions passed in props
 ***********************************************************************/

import { useState } from "react"; // remove later
import "../style.css";

export function HeaderView(props) {
    // Use internal state for testing, remove later
    const [query, setQuery] = useState(""); 

    // Fallbacks for testing, remove later
    const onNavigateHome = props.onNavigateHome || (() => console.log("navigateHomeACB triggered"));
    const onSearch = props.onSearch || ((q) => console.log("searchACB triggered:", q));
    const onProfile = props.onProfile || (() => console.log("profileACB triggered"));
    const onSignIn = props.onSignIn 

    function navigateHomeACB() {
        console.log("HeaderView: navigateHomeACB triggered");
        // props.onNavigateHome();
        onNavigateHome(); // remove later
    }

    function queryChangeACB(event) {
        console.log("HeaderView: queryChangeACB triggered, new query =", event.target.value);
        // props.onQueryChange(event.target.value);
        // remove later
        setQuery(event.target.value); // update local state
        if (props.onQueryChange) props.onQueryChange(event.target.value);
    }

    function searchACB() {
        console.log("HeaderView: searchACB triggered with query =", props.query);
        // props.onSearch(props.query);
        onSearch(query); // remove later
    }

    function profileACB() {
        console.log("HeaderView: profileACB triggered");
        // props.onProfile();
        onProfile(); // remove later
    }
    function signInACB(){
        console.log("HeaderView: signInACB triggered");
        onSignIn();
    }

    return (
        <header className="header-bar">

            {/* LEFT: Logo + Title */}
            <div className="header-left" onClick={navigateHomeACB}>
                <img
                    src="/WeebCultLogo.png"
                    alt="WeebCult Logo"
                    className="header-logo"
                />
                <span className="header-title">WeebCult</span>
            </div>

            {/* CENTER: Search Bar */}
            <div className="header-center">

                <div className="search-row">
                    <input
                        type="text"
                        placeholder="Search anime..."
                        // value={props.query}
                        value={query} // remove later
                        onChange={queryChangeACB}
                        className="header-search-input"
                    />

                    <button
                        onClick={searchACB}
                        className="header-search-button"
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>

                {/* CONDITIONAL FILTERS */}
                {query.length > 0 && (
                    <div className="search-filters">
                        <select>
                            <option value="">Type</option>
                            <option value="tv">TV</option>
                            <option value="movie">Movie</option>
                        </select>

                        <select>
                            <option value="">Status</option>
                            <option value="airing">Airing</option>
                            <option value="completed">Completed</option>
                            <option value="upcoming">Upcoming</option>
                        </select>

                        <select>
                            <option value="">Rating</option>
                            <option value="g">G</option>
                            <option value="pg">PG</option>
                            <option value="pg13">PG-13</option>
                            <option value="r">R</option>
                        </select>

                        <select>
                            <option value="">Genres</option>
                            <option value="action">Action</option>
                            <option value="comedy">Comedy</option>
                            <option value="drama">Drama</option>
                        </select>

                        <select>
                            <option value="">Order By</option>
                            <option value="score">Score</option>
                            <option value="popularity">Popularity</option>
                            <option value="favorites">Favorites</option>
                        </select>
                    </div>
                )}

            </div>

            {/* RIGHT: Profile Button */}
            <div className="header-right">
                <button onClick={signInACB} className="profile-button">{props.userName || "Sign in!"}</button>
                <button onClick={profileACB} className="profile-button">
                    Profile
                </button>
            </div>

        </header>
    );
}
