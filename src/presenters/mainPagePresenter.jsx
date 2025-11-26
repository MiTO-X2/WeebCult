/***********************************************************************
 * PURPOSE:
 *   - Provide logic for the main/home page
 *   - Load trending anime + genres on mount
 *   - Selects promise states from Redux (animeSlice)
 *   - Pass transformed data to MainPageView
 *   - Show suspense (Loader) when promiseState is pending
 ***********************************************************************/

import { connect } from "react-redux";
import { MainPageView } from "../views/mainPageView";

export function MainPagePresenter() {

    // TODO:
    //
    // 1. mapStateToProps(state):
    //        trendingPS = state.anime.trending.promiseState
    //        genresPS   = state.anime.genres.promiseState
    //
    // 2. mapDispatchToProps(dispatch):
    //        loadTrending(): dispatch(fetchTrending())
    //        loadGenres():   dispatch(fetchGenres())
    //
    // 3. In mergeProps:
    //        - Call loadTrending() and loadGenres() when presenter mounts
    //
    // 4. Suspense logic BEFORE rendering View:
    //        if trendingPS.pending OR genresPS.pending → <Loader />
    //        if trendingPS.error OR genresPS.error → <ErrorView />
    //
    // 5. Transform data if needed
    //
    // 6. Render MainPageView:
    //        <MainPageView
    //            trending={trendingPS.data}
    //            genres={genresPS.data}
    //         />
    //
    // Use connect() to export
}
