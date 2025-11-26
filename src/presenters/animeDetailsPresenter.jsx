/***********************************************************************
 * PURPOSE:
 *   - Present details for a single anime in a modal
 *   - Presenter = Redux-connected container
 *   - Dispatch thunks for details + characters
 *   - Pass state + callbacks to AnimeDetailsView (pure)
 *   - Typically used inside a modal triggered from Main/Search
 ***********************************************************************/

import { connect } from "react-redux";
import { AnimeDetailsView } from "../views/animeDetailsView";

export function AnimeDetailsPresenter() {

    // TODO (Redux-based presenter):
    //
    // 1. mapStateToProps(state, ownProps):
    //        - extract animeId from ownProps
    //        - select:
    //              detailsPS = state.details.details.promiseState
    //              charPS = state.details.characters.promiseState
    //
    // 2. mapDispatchToProps(dispatch, ownProps):
    //        - loadDetails(): dispatch(loadAnimeDetails(ownProps.animeId))
    //        - loadCharacters(): dispatch(loadAnimeCharacters(ownProps.animeId))
    //
    // 3. ComponentDidMount/Update equivalent:
    //        - inside mergeProps, check if id changed → call loadDetails + loadCharacters
    //
    // 4. Suspense logic happens in presenter BEFORE rendering the View:
    //        if pending → return <Loader />
    //        if error → return <ErrorView />
    //
    // 5. Finally return:
    //        <AnimeDetailsView
    //            anime={detailsPS.data}
    //            characters={charPS.data}
    //            onClose={ownProps.onClose}
    //        />
    //
    // Export:
    //    export connect(mapStateToProps, mapDispatchToProps, mergeProps)(AnimeDetailsPresenter);
}
