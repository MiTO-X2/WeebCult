import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setSelectedAnimeId, loadAnimeDetails, loadAnimeCharacters } from "../slices/detailsSlice.js";

export const detailsListener = createListenerMiddleware();

detailsListener.startListening({
  actionCreator: setSelectedAnimeId,
  effect: async (action, listenerApi) => {
    const id = action.payload;
    if (!id) return; // closing modal

    await listenerApi.dispatch(loadAnimeDetails(id));
    await listenerApi.dispatch(loadAnimeCharacters(id));
  }
});
