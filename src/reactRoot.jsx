/***********************************************************************
 * This file defines the main routing structure for the app.
 * It should:
 *    - Display the top-level layout (HeaderPresenter, etc.)
 *    - Declare all route → Presenter mappings
 *
 * It should NOT:
 *    - Contain business logic
 *    - Fetch data directly
 *    - Hold app state
 *    - Access Jikan API directly
 *
 * NOTES:
 *    - ReactRoot is NOT a presenter.
 *    - ReactRoot is NOT allowed to fetch data.
 *    - ReactRoot ONLY wires navigation and visual layout.
 *    - If a route needs data, the presenter handles it by dispatching Redux actions.
 *
 ***********************************************************************/

import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { SuspenseView } from "./views/suspenseView.jsx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { MainPagePresenter } from "./presenters/mainPagePresenter.jsx";
import { AnimeDetailsPresenter } from "./presenters/animeDetailsPresenter.jsx";
import { SidebarPresenter } from "./presenters/sidebarPresenter.jsx";
import { LeaderboardPresenter } from "./presenters/leaderboardPresenter.jsx";
import { HeaderPresenter } from "./presenters/headerPresenter.jsx";
import { FooterView } from "./views/footerView.jsx";
import { GamePresenter } from "./presenters/gamePresenter.jsx";
import { GameScorePresenter } from "./presenters/gameScorePresenter.jsx";

export function ReactRoot() {
    const uid = useSelector(state => state.user.uid);
    const ready = useSelector(state => state.user.ready);

    // CASE 1: Firebase auth not initialized yet
    if (uid === undefined) {
        console.log("uid in ReactRoot:", uid);
        return <SuspenseView promise={true} />;
    }

    // CASE 2: App rendering (logged in OR logged out)
    return <AppShell ready={ready} />;
}

function AppShell({ ready }) {
    if (!ready) {
        return <SuspenseView promise={true} />;
    }

    const router = createHashRouter([
    {
        element: <MainLayout />,
        children: [
            { path: "/", element: <MainPagePresenter /> },
            { path: "/main", element: <MainPagePresenter /> }
        ]
    },
    {
        path: "/game",
        element: <GamePresenter />
    },
    {
        path: "/score",
        element: <GameScorePresenter />
    }
    ]);

    return (
        <div className="App-background">
            <div>
                <RouterProvider router={router} />
            </div>

            <div>
                <AnimeDetailsPresenter />
            </div>

            <div>
                <SidebarPresenter />
            </div>

            <div>
                <LeaderboardPresenter />
            </div>
        </div>
    );
}

function MainLayout() {
  return (
    <>
      <HeaderPresenter />

      <Outlet />

      <FooterView />
    </>
  );
}
