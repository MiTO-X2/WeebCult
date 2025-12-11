/***********************************************************************
 * PURPOSE:
 *   - Provide logic for the main/home page
 *   - Load trending anime + genres on mount
 *   - Selects promise states from Redux (animeSlice)
 *   - Pass transformed data to MainPageView
 *   - Show suspense (Loader) when promiseState is pending
 ***********************************************************************/

import React from "react";
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

  /***************************************************************
 * DEMO SECTION – For testing Kitsu streaming link functions
 * -------------------------------------------------------------
 * This will run once when the component mounts.
 * It tests:
 *   - searchAnimeLinkAPI()
 *   - getStreamingLinksByAnimeId()
 *   - searchAnimeAndGetStreamingLinks()
 ***************************************************************/
  const [demoResult, setDemoResult] = React.useState(null);

  React.useEffect(() => {
      // Lazy import so the file loads instantly
      import("../api/animeSource.js").then(({ 
          searchAnimeLinkAPI, 
          getStreamingLinksByAnimeId, 
          searchAnimeAndGetStreamingLinks 
      }) => {

          // TEST search → streaming links for "Naruto"
          searchAnimeAndGetStreamingLinks("Naruto")
              .then(result => {
                  console.log("=== TEST: Naruto streaming links ===", result);
                  setDemoResult(result);
              })
              .catch(err => console.error("Demo error:", err));
      });
  }, []);

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
    <div style={{ padding: "1rem" }}>
      {/* DEMO DISPLAY BLOCK */}
      {demoResult && (
        <div style={{
          background: "#222",
          padding: "1rem",
          borderRadius: "10px",
          marginBottom: "1rem",
          color: "white"
        }}>
          <h2 style={{ marginTop: 0 }}> Kitsu Streaming Demo</h2>
          <p><b>Anime:</b> {demoResult.anime?.title}</p>

          <p><b>Streaming Links:</b></p>
          {demoResult.streamingLinks.length === 0 && (
            <p>No streaming links found.</p>
          )}

          {demoResult.streamingLinks.map((link) => (
            <div key={link.id} style={{ marginBottom: "0.5rem" }}>
              <b>{link.site}</b>:{" "}
              <a href={link.url} target="_blank" rel="noreferrer" style={{ color: "cyan" }}>
                {link.url}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* EXISTING VIEW */}
      <MainPageView 
        {...props} 
        searchResults={searchResults}
        onSelectAnime={handleSelectAnimeACB} 
      />
    </div>
  );
}

export const MainPagePresenter = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPagePresenterComponent);
