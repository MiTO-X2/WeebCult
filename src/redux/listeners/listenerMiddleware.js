import { createListenerMiddleware, createAction } from "@reduxjs/toolkit";
import { fetchTrending, fetchAllGenres, fetchAnimeByGenre, appInitialized } from "../slices/animeSlice.js";

export const listenerMiddleware = createListenerMiddleware();

export const appInit = createAction("APP_INIT");

const MAIN_GENRES = ["Action", "Comedy", "Slice of Life", "Fantasy"];

// Helper: abort-safe dispatch ----------
async function safeDispatch(listenerApi, thunk) {
  if (listenerApi.signal.aborted) return null;
  return listenerApi.dispatch(thunk).unwrap();
}

listenerMiddleware.startListening({
  actionCreator: appInit,
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState();

    if (state.anime.appInitialized) return;

    listenerApi.cancelActiveListeners();
    listenerApi.dispatch(appInitialized());

    try {
      // Fetch trending anime
      await safeDispatch(listenerApi, fetchTrending());

      // Fetch all genres
      const allGenres = await safeDispatch(listenerApi, fetchAllGenres());
      if (!allGenres) return;

      // Filter main genres
      const mainGenres = allGenres.filter(g => MAIN_GENRES.includes(g.name));

      // Fetch anime by genre in series
      for (const genre of mainGenres) {
        await safeDispatch(
          listenerApi,
          fetchAnimeByGenre({ genreID: genre.id, genreName: genre.name })
        );

        // short delay to avoid hammering API
        await new Promise(res => setTimeout(res, 1000));
      }
    } catch (err) {
      console.error("App init failed:", err);
    }
  }
});
