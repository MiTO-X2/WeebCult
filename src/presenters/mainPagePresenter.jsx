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
    searchResults: state.anime.search.promiseState.data || [],
    trendingPromise: state.anime.trending.promiseState.promise,
    genresPromise: state.anime.genres.promiseState.promise,
    searchPromise: state.anime.search.promiseState.promise,
    trendingError: state.anime.trending.promiseState.error,
    genresError: state.anime.genres.promiseState.error,
    searchError: state.anime.search.promiseState.error
  };
}

const mapDispatchToProps = {
  loadTrending: fetchTrending,
  loadGenres: fetchGenres,
  setSelectedAnimeId
};

function MainPagePresenterComponent({
  trendingPromise, genresPromise, searchPromise,
  searchResults, trendingError, genresError,
  searchError, ...props
}) {

  // Combine promises and errors
  const isPending = trendingPromise || genresPromise || searchPromise;
  const combinedError = trendingError || genresError || searchError;

  // Show SuspenseView if any promise is pending or there’s an error
  if (isPending || combinedError) {
    return <SuspenseView promise={isPending} error={combinedError} />;
  }

  // Handler when user clicks on a row item
  const handleSelectAnimeACB = (anime) => {
      props.setSelectedAnimeId(anime.id);
  };

  return ( 
    <MainPageView 
      {...props} 
      searchResults={searchResults}
      onSelectAnime={handleSelectAnimeACB} 
    />
  );
}

export const MainPagePresenter = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPagePresenterComponent);
