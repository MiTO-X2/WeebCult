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
import WeebCultLogo from "../WeebCultLogo.png";

export function FooterView() {

    function handleOnNavigateHomeACB(){
        window.location.href = "/";
    }
    
    return (
        <footer className="footer-bar">

            {/* LOGO */}
            <div className="footer-logo" onClick={handleOnNavigateHomeACB}>
                <img
                    src={WeebCultLogo}
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
