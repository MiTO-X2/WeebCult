import { createListenerMiddleware } from "@reduxjs/toolkit";
import { fetchTrending, fetchGenres, fetchAnimeByGenre } from "../slices/animeSlice.js";

export const listenerMiddleware = createListenerMiddleware();

// 1) App initialization listener
listenerMiddleware.startListening({
  predicate: (action) => action.type === "APP_INIT",
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
