/***********************************************************************
 * Pure top navigation UI.
 * Contains:
 *  - Title (WeebCult)
 *  - Search input box and search button
 *  - Logout button
 ***********************************************************************/

export function HeaderView(props) {

    // TODO:
    // - Render a simple top nav bar
    // - When user clicks search → onSearch()
    // - When logout → onLogout()
    // - NO internal logic, NO data fetching

    return (
        <header className="header">

            <div className="title" onClick={() => props.onSearch("")}>
                WeebCult
            </div>

            <button onClick={() => props.onSearch()}>
                Search
            </button>

            <button onClick={props.onLogout}>
                Logout
            </button>

        </header>
    );
}
