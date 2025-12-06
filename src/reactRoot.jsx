// This file defines the main routing structure for the app.
// It should:
//    - Set up <BrowserRouter>
//    - Display the top-level layout (HeaderPresenter, etc.)
//    - Declare all route → Presenter mappings
//
// It should NOT:
//    - Contain business logic
//    - Fetch data directly
//    - Hold app state
//    - Access Jikan API directly
//
// NOTES:
// - ReactRoot is NOT a presenter.
// - ReactRoot is NOT allowed to fetch data.
// - ReactRoot ONLY wires navigation and visual layout.
// - If a route needs data, the presenter handles it by dispatching Redux actions.
//
// All views MUST be controlled by presenters.


import { createHashRouter, RouterProvider } from "react-router-dom";

// TODO: import presenters (not views!) used in the routes
import { MainPagePresenter } from "./presenters/mainPagePresenter.jsx";
// import { SearchPresenter } from "./presenters/searchPresenter.jsx";
import { AnimeDetailsPresenter } from "./presenters/animeDetailsPresenter.jsx";
// import { AuthPresenter } from "./presenters/authPresenter.jsx";
import { HeaderPresenter } from "./presenters/headerPresenter.jsx";
import { FooterView } from "./views/footerView.jsx";

export function ReactRoot() {
    const router = createHashRouter([
        {
            path: "/",
            element: <MainPagePresenter />
        },
        {
            path: "/main",
            element: <MainPagePresenter />
        }
        /*{
            path: "/game",
            element: <GamePresenter />
        },
        {
            path: "/login",
            element: <AuthPresenter />
        }*/
    ]);

    return (
        <div className="App-background">
            <div>
                <HeaderPresenter />
            </div>
            
            <div>
                <MainPagePresenter />
            </div>

            <div>
                <AnimeDetailsPresenter />
            </div>

            <div>
                <FooterView onNavigateHome={() => window.location.href = "/"} />
            </div>
        </div>
    );
}
