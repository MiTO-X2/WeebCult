/***********************************************************************
 * PURPOSE:
 *   - Manage search page logic
 *   - Listen to model/searchState via Redux
 *   - Dispatch search thunk when query changes
 *   - Handle promiseState (pending/error/data)
 *   - Pass results to SearchView
 ***********************************************************************/

export function SearchPresenter() {

    // TODO:
    // 1. Import dispatch + fetchSearch(query)
    // 2. Extract query param from router (useSearchParams or useParams)

    // 3. useEffect(() => {
    //        if(query) dispatch(fetchSearch(query))
    //    }, [query])

    // 4. useSelector to read:
    //        searchPS = state.anime.search.promiseState

    // 5. If searchPS.promise && !searchPS.data: <Loader />

    // 6. If searchPS.error: show <ErrorView message={...} />

    // 7. return <SearchView results={searchPS.data} query={query} />
}
