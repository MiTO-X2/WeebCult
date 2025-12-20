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
import { openSidebar } from "../redux/slices/sidebarSlice.js";
import { selectGenreLists } from "../redux/slices/animeSlice.js";
import { setSelectedAnimeId } from "../redux/slices/detailsSlice.js";
import { openLeaderboard } from "../redux/slices/leaderboardSlice.js";

function mapStateToProps(state) {
  return {
    trending: state.anime.trending.promiseState.data || [],
    trendingLoaded: state.anime.trending.loaded,
    genres: selectGenreLists(state),
    searchResults: state.anime.search.promiseState.data || [],
    trendingPromise: state.anime.trending.promiseState.promise,
    allGenresPromise: state.anime.allGenres.promiseState.promise,
    searchPromise: state.anime.search.promiseState.promise,
    trendingError: state.anime.trending.promiseState.error,
    allGenresError: state.anime.allGenres.promiseState.error,
    searchError: state.anime.search.promiseState.error,
    userUid: state.user.uid // User UID for fetching leaderboard
  };
}

const mapDispatchToProps = {
  setSelectedAnimeId,
  onOpenSidebar: openSidebar,
  onOpenLeaderboard: openLeaderboard
};

function MainPagePresenterComponent(props) {
  const genresNotReady = props.genres.length === 0 || props.genres.some(g => g.items == null)

  const isPending = !props.trendingLoaded || !!props.trendingPromise  || !!props.allGenresPromise  || genresNotReady;
  const combinedError = props.trendingError || props.allGenresError || props.searchError;

  if (isPending || combinedError) {
    return <SuspenseView promise={isPending} error={combinedError} />;
  }

  const handleSelectAnimeACB = (anime) => props.setSelectedAnimeId(anime.id);

  return (
    <MainPageView 
      {...props} 
      onSelectAnime={handleSelectAnimeACB} 
    />
  );
}

export const MainPagePresenter = 
    connect(mapStateToProps, mapDispatchToProps)(MainPagePresenterComponent);
