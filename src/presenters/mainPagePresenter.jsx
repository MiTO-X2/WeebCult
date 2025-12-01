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

// Remove the following imports later, used for testing
import { useEffect, useState } from "react";
import { searchAnime, getTopAnime, getAnimeByGenre } from "../api/animeSource.js";

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


    /***********************Remove the following code later, used for testing***********************/
    const [trending, setTrending] = useState([]);
    const [action, setAction] = useState([]);
    const [comedy, setComedy] = useState([]);
    const [sliceOfLife, setSliceOfLife] = useState([]);
    const [fantasy, setFantasy] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function fetchData() {
        try {
            setLoading(true);

            // Fetch trending first
            try {
                const trendingData = await getTopAnime();
                setTrending(trendingData);
            } catch (err) {
                console.error("Error fetching trending anime:", err);
            }

            // Fetch genres sequentially to avoid 429
            try {
                const actionData = await getAnimeByGenre(1);
                setAction(actionData);
            } catch (err) {
                console.error("Error fetching Action anime:", err);
                setAction([]); // fallback empty
            }

            try {
                const comedyData = await getAnimeByGenre(4);
                setComedy(comedyData);
            } catch (err) {
                console.error("Error fetching Comedy anime:", err);
                setComedy([]);
            }

            try {
                const sliceData = await getAnimeByGenre(36);
                setSliceOfLife(sliceData);
            } catch (err) {
                console.error("Error fetching Slice of Life anime:", err);
                setSliceOfLife([]);
            }

            try {
                const fantasyData = await getAnimeByGenre(10);
                setFantasy(fantasyData);
            } catch (err) {
                console.error("Error fetching Fantasy anime:", err);
                setFantasy([]);
            }

        } catch (err) {
            console.error("Unexpected error fetching anime:", err);
        } finally {
            setLoading(false);
        }
    }

    fetchData();
    }, []);


    function handleSelectAnime(anime) {
        console.log("Anime selected:", anime.title);
    }

    if (loading) return <div style={{ color: "white", padding: "20px" }}>Loading anime...</div>;

    return (
        <MainPageView
            trending={trending}
            action={action}
            comedy={comedy}
            sliceOfLife={sliceOfLife}
            fantasy={fantasy}
            onSelectAnime={handleSelectAnime}
        />
    );
}