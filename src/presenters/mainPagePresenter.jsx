/***********************************************************************
 * PURPOSE:
 *   - Provide logic for the main/home page
 *   - Load trending anime + genres on mount
 *   - Select trending + genres from Redux (animeSlice)
 *   - Pass transformed data to MainPageView
 *   - Show suspense (Loader) when promiseState is pending
 ***********************************************************************/

export function MainPagePresenter() {

    // TODO:
    // 1. useDispatch() to dispatch thunks:
    //        fetchTrending()
    //        fetchGenres()

    // 2. useEffect(() => dispatch(fetchTrending()), [])
    //    useEffect(() => dispatch(fetchGenres()), [])

    // 3. useSelector to grab:
    //        trendingState = state.anime.trending.promiseState
    //        genresState = state.anime.genres.promiseState

    // 4. If trendingState.promise != null && trendingState.data == null:
    //        return <Loader />

    // 5. Same logic for genresState

    // 6. Transform data if needed (e.g. top 10, group categories)

    // 7. return <MainPageView trending={...} genres={...} />
}
