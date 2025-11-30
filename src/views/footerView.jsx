/***********************************************************************
 * PURE UI COMPONENT
 * 
 * Footer:
 *  - Logo (clickable → navigate home)
 *  - "Made with ♡ by:"
 *  - "Team WeebCult"
 *
 * RULES:
 *  - No data fetching
 *  - No state management
 *  - Only calls props callbacks
 ***********************************************************************/

import "../style.css";

export function FooterView(props) {
    return (
        <footer className="footer-bar">

            {/* LOGO */}
            <div className="footer-logo" onClick={props.onNavigateHome}>
                <img
                    src="/WeebCultLogo.png"
                    alt="WeebCult Logo"
                    className="footer-logo-img"
                />
            </div>

            {/* TEXT LINES */}
            <div className="footer-text">
                <p>Made with <span>♡</span> by:</p>
                <p>Team WeebCult</p>
            </div>

        </footer>
    );
}
