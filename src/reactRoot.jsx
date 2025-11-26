// TODO: This file defines the main routing structure for the app.
//       It should:
//         - Set up <BrowserRouter>
//         - Display the top-level layout (HeaderPresenter, etc.)
//         - Declare all route → Presenter mappings
//       It should NOT:
//         - Contain business logic
//         - Fetch data directly
//         - Hold app state
//         - Access Jikan API directly
//
// All views MUST be controlled by presenters.

import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// TODO: import presenters (not views!) used in the routes
// import { MainPagePresenter } from "./presenters/mainPagePresenter.jsx";
// import { SearchPresenter } from "./presenters/searchPresenter.jsx";
// import { AnimeDetailsPresenter } from "./presenters/animeDetailsPresenter.jsx";
// import { AuthPresenter } from "./presenters/authPresenter.jsx";

export function ReactRoot() {
    return (
        // <BrowserRouter>

            <>
                {/* TODO: global layout components */}
                {/* <HeaderPresenter/SearchPresenter /> */}

                {/* TODO: define all routes that render presenters */}
                {/* 
                <Routes>
                    <Route path="/" element={<MainPagePresenter />} />
                    <Route path="/search" element={<SearchPresenter />} />
                    <Route path="/anime/:id" element={<AnimeDetailsPresenter />} />
                    <Route path="/login" element={<AuthPresenter />} />
                </Routes>
                */}

                {/* <FooterView /> (maybe) */}
            </>
        // </BrowserRouter>
    );
}

// NOTES:
// - ReactRoot is NOT a presenter.
// - ReactRoot is NOT allowed to fetch data.
// - ReactRoot ONLY wires navigation and visual layout.
// - If a route needs data, the presenter handles it by dispatching Redux actions.
