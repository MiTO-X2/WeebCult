/***********************************************************************
 * PURPOSE:
 *   - Manage search page logic
 *   - Listen to model/searchState via Redux
 *   - Dispatch search thunk when query changes
 *   - Handle promiseState (pending/error/data)
 *   - Pass results to SearchView
 ***********************************************************************/

import { connect } from "react-redux";
import { SearchView } from "../views/searchView";

export function SearchPresenter() {

    // TODO:
    //
    // 1. mapStateToProps(state, ownProps):
    //        query     = ownProps.query
    //        searchPS  = state.anime.search.promiseState
    //
    // 2. mapDispatchToProps(dispatch, ownProps):
    //        executeSearch(): dispatch(fetchSearch(ownProps.query))
    //
    // 3. In mergeProps:
    //        - If query changed → call executeSearch()
    //
    // 4. Suspense logic:
    //        if searchPS.pending → <Loader />
    //        if searchPS.error → <ErrorView />
    //
    // 5. Return SearchView:
    //        <SearchView
    //            query={query}
    //            results={searchPS.data}
    //        />
    //
    // Connect + export presenter
}
