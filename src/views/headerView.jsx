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

import "../style.css";
import WeebCultLogo from "../WeebCultLogo.png";

export function HeaderView(props) {
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
            props.onLogout?.();   // call logout
        } else {
            props.onLogin?.();    // call login
        }
    }

    function handleFilterChangeACB(action, value) {
        action(value);
        props.onSearch(); // trigger search automatically
    }

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

            {/* CENTER: Search Bar */}
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
                </div>

                {/* FILTERS (only show if user typed something) */}
                {/*props.query?.length > 0 && (*/}
                    <div className="search-filters">

                        {/* TYPE */}
                        <select
                            value={props.selectedType || ""}
                            onChange={e => handleFilterChangeACB(props.onTypeChange, e.target.value)}
                        >
                            <option value="">Type</option>
                            {props.typeOptions?.map(renderOptionCB)}
                        </select>

                        {/* STATUS */}
                        <select
                            value={props.selectedStatus || ""}
                            onChange={e => handleFilterChangeACB(props.onStatusChange, e.target.value)}
                        >
                            <option value="">Status</option>
                            {props.statusOptions?.map(renderOptionCB)}
                        </select>

                        {/* RATING */}
                        <select
                            value={props.selectedRating || ""}
                            onChange={e => handleFilterChangeACB(props.onRatingChange, e.target.value)}
                        >
                            <option value="">Rating</option>
                            {props.ratingOptions?.map(renderOptionCB)}
                        </select>

                        {/* GENRES (multi-select) */}
                        <select
                            value={props.selectedGenres[0] || ""}
                            onChange={e => handleFilterChangeACB(props.onGenresChange, [e.target.value])}
                        >
                            <option value="">Genre</option>
                            {props.genreOptions?.map(renderGenreCB)}
                        </select>

                        {/* ORDER BY */}
                        <select
                            value={props.selectedOrderBy || ""}
                            onChange={e => handleFilterChangeACB(props.onOrderByChange, e.target.value)}
                        >
                            <option value="">Order By</option>
                            {props.orderByOptions?.map(renderOptionCB)}
                        </select>

                    </div>
                {/*})}*/}

            </div>

            {/* RIGHT: Profile Button */}
            <div className="header-right">
                <button onClick={handleProfileClickACB} className="profile-button">
                    {props.isLoggedIn ? "Logout" : "Login"}
                </button>
            </div>

        </header>
    );

    function renderOptionCB(option) {
        return <option key={option} value={option}>{option}</option>;
    }

    function renderGenreCB(genre) {
        const key = genre.mal_id || genre.name;
        return <option key={key} value={genre.name}>{genre.name}</option>;
    }
}
