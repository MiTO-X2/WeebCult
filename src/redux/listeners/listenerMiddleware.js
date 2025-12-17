import { createListenerMiddleware, createAction } from "@reduxjs/toolkit";
import { fetchTrending, fetchAllGenres, fetchAnimeByGenre, appInitialized } from "../slices/animeSlice.js";

export const listenerMiddleware = createListenerMiddleware();

export const appInit = createAction("APP_INIT");

const MAIN_GENRES = ["Action", "Comedy", "Slice of Life", "Fantasy"];

listenerMiddleware.startListening({
  actionCreator: appInit,
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState();

    if (state.anime.appInitialized) return;

    listenerApi.cancelActiveListeners();
    listenerApi.dispatch(appInitialized());

    try {
      await listenerApi.dispatch(fetchTrending()).unwrap();

      if (listenerApi.signal.aborted) return;

      const allGenres = await listenerApi.dispatch(fetchAllGenres()).unwrap();
      const mainGenres = allGenres.filter(g => MAIN_GENRES.includes(g.name));

      for (const genre of mainGenres) {
        await listenerApi
          .dispatch(fetchAnimeByGenre({ genreID: genre.id, genreName: genre.name }))
          .unwrap();
        await new Promise(res => setTimeout(res, 1000));

        if (listenerApi.signal.aborted) return;
      }
    } catch (err) {
      console.error("App init failed:", err);
    }
  }
});
