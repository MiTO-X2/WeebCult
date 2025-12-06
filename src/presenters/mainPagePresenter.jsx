/***********************************************************************
 * PURPOSE:
 *   - Provide logic for the main/home page
 *   - Load trending anime + genres on mount
 *   - Selects promise states from Redux (animeSlice)
 *   - Pass transformed data to MainPageView
 *   - Show suspense (Loader) when promiseState is pending
 ***********************************************************************/

import { connect } from "react-redux";
import { MainPageView } from "../views/mainPageView.jsx";
import { SuspenseView } from "../views/suspenseView.jsx";
import { fetchTrending, fetchGenres } from "../redux/slices/animeSlice.js";
import { setSelectedAnimeId } from "../redux/slices/detailsSlice.js";

function mapStateToProps(state) {
  return {
    trending: state.anime.trending.promiseState.data || [],
    genres: state.anime.genreLists || [],
    trendingPromise: state.anime.trending.promiseState.promise,
    genresPromise: state.anime.genres.promiseState.promise
  };
}

const mapDispatchToProps = {
  loadTrending: fetchTrending,
  loadGenres: fetchGenres,
  setSelectedAnimeId
};

function MainPagePresenterComponent({
  trendingPromise, genresPromise, ...props
}) {

  // Suspense
  if (trendingPromise || genresPromise) {
    return <SuspenseView />;
  }

  // Handler when user clicks on a row item
  const handleSelectAnimeACB = (anime) => {
      props.setSelectedAnimeId(anime.id);
  };

  return <MainPageView {...props} onSelectAnime={handleSelectAnimeACB} />;
}

export const MainPagePresenter = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPagePresenterComponent);
