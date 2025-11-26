/***********************************************************************
 * PURPOSE:
 *   - Present details for a single anime
 *   - Load anime details + characters
 *   - Handle promiseState for both
 *   - Typically used inside a modal triggered from Main/Search
 ***********************************************************************/

export function AnimeDetailsPresenter({ animeId, onClose }) {

    // TODO:
    // 1. useDispatch + thunks:
    //        loadAnimeDetails(animeId)
    //        loadAnimeCharacters(animeId)

    // 2. useEffect(() => dispatch(loadAnimeDetails(id)), [animeId])
    //    useEffect(() => dispatch(loadAnimeCharacters(id)), [animeId])

    // 3. Select from Redux:
    //        detailsPS = state.details.details.promiseState
    //        charPS = state.details.characters.promiseState

    // 4. Suspense:
    //        if(detailsPS.pending OR charPS.pending) <Loader />

    // 5. If error: <ErrorView />

    // 6. return <AnimeDetailsView
    //           anime={detailsPS.data}
    //           characters={charPS.data}
    //           onClose={onClose}
    //         />
}
