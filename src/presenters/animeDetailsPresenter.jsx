/***********************************************************************
 * PURPOSE:
 *   - Present details for a single anime in a modal
 *   - Presenter = Redux-connected container
 *   - Dispatch thunks for details + characters
 *   - Pass state + callbacks to AnimeDetailsView (pure)
 *   - Typically used inside a modal triggered from Main/Search
 ***********************************************************************/

// import { connect } from "react-redux";
// import { AnimeDetailsView } from "../views/animeDetailsView";

// export function AnimeDetailsPresenter() {

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
//}

import { useState } from "react";
import { MainPageView } from "../views/mainPageView";
import { AnimeDetailsView } from "../views/animeDetailsView";

export function AnimeDetailsPresenter() {

    /************** 1. TEST DATA ******************/
    const fakeTrending = [
        { mal_id: 1, title: "Attack on Titan", images: { jpg: { image_url: "https://cdn.myanimelist.net/images/anime/10/47347.jpg" }}},
        { mal_id: 2, title: "Jujutsu Kaisen", images: { jpg: { image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg" }}},
        { mal_id: 3, title: "Solo Leveling", images: { jpg: { image_url: "https://cdn.myanimelist.net/images/anime/1614/120003.jpg" }}},
    ];

    const fakeCharacters = [
        { name: "Eren Yeager", age: "15" },
        { name: "Levi Ackerman", age: "34" },
        { name: "Mikasa Ackerman", age: "15" }
    ];

    /************** 2. STATE FOR POPUP ******************/
    const [selectedAnime, setSelectedAnime] = useState(null);

    const [category, setCategory] = useState(null);     // "name" | "age"
    const [mode, setMode] = useState(null);             // "solo" | "1v1"
    const [type, setType] = useState(null);             // "best10" | "timed"

    /************** 3. SELECT ANIME ******************/
    function handleSelectAnime(anime) {
        console.log("Opening popup for:", anime.title);

        setSelectedAnime(anime);

        // RESET previous choices
        setCategory(null);
        setMode(null);
        setType(null);
    }

    /************** 4. PLAY BUTTON ******************/
    function handlePlay() {
        console.log("PLAY pressed with:", {
            anime: selectedAnime.title,
            category,
            mode,
            type,
        });
        alert(`Playing quiz for ${selectedAnime.title}!`);
    }

    /************** 5. CLOSE POPUP ******************/
    function handleClose() {
        setSelectedAnime(null);
    }

    /************** 6. RENDER BOTH: MAIN PAGE + POPUP ******************/
    return (
        <div>
            <MainPageView
                trending={fakeTrending}
                action={fakeTrending}
                comedy={fakeTrending}
                sliceOfLife={fakeTrending}
                fantasy={fakeTrending}
                onSelectAnime={handleSelectAnime}
            />

            <AnimeDetailsView
                anime={selectedAnime}
                characters={fakeCharacters}
                selectedCategory={category}
                selectedMode={mode}
                selectedType={type}
                onSelectCategory={setCategory}
                onSelectMode={setMode}
                onSelectType={setType}
                onPlay={handlePlay}
                onClose={handleClose}
            />
        </div>
    );
}
