import { createListenerMiddleware, createAction } from "@reduxjs/toolkit";
import { fetchTrending, fetchGenres, fetchAnimeByGenre } from "../slices/animeSlice.js";

export const listenerMiddleware = createListenerMiddleware();

export const appInit = createAction("APP_INIT");

// 1) App initialization listener
listenerMiddleware.startListening({
  actionCreator: appInit,
  effect: async (_, listenerApi) => {
    listenerApi.dispatch(fetchTrending());
    listenerApi.dispatch(fetchGenres());
  }
});

// 2) When genres load, fetch anime by genre automatically
listenerMiddleware.startListening({
  actionCreator: fetchGenres.fulfilled,
  effect: async (action, listenerApi) => {
    const genres = action.payload; // already filtered in slice
    for (const genre of genres) {
      listenerApi.dispatch(fetchAnimeByGenre({ genreID: genre.id, genreName: genre.name }));
      await new Promise(res => setTimeout(res, 1000)); // 1000ms delay between calls
    }
  }
});
