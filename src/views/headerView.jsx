/***********************************************************************
 * Pure top navigation UI.
 * Contains:
 *  - Logo/Title (WeebCult)
 *  - Search input box and search button
 *  - Logout button
 ***********************************************************************/

export function HeaderView({ onSearch, onLogout }) {

    // TODO:
    // - Render nav bar
    // - Trigger onSearch() when clicking search icon
    // - Trigger onLogout() when clicking logout

    return (
        <header className="header">

            <div className="title" onClick={() => onSearch("")}>
                WeebCult
            </div>

            <button onClick={onSearch}>Search</button>

            <button onClick={onLogout}>Logout</button>

        </header>
    );
}
