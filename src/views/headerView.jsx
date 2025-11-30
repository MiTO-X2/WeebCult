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

export function HeaderView(props) {
    function navigateHomeACB() {
        console.log("HeaderView: navigateHomeACB triggered");
        props.onNavigateHome();
    }

    function queryChangeACB(event) {
        console.log("HeaderView: queryChangeACB triggered, new query =", event.target.value);
        props.onQueryChange(event.target.value);
    }

    function searchACB() {
        console.log("HeaderView: searchACB triggered with query =", props.query);
        props.onSearch(props.query);
    }

    function profileACB() {
        console.log("HeaderView: profileACB triggered");
        props.onProfile();
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

                <input
                    type="text"
                    placeholder="Search anime..."
                    value={props.query}
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

            {/* RIGHT: Profile Button */}
            <div className="header-right">
                <button onClick={profileACB} className="profile-button">
                    Profile
                </button>
            </div>

        </header>
    );
}
