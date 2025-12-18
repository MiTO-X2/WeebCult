import { createListenerMiddleware } from "@reduxjs/toolkit";
import { openSidebar } from "../slices/sidebarSlice";
import { fetchRandomNeko } from "../slices/nekoSlice";

export const sidebarListener = createListenerMiddleware();

sidebarListener.startListening({
    actionCreator: openSidebar,
    effect: async (_, listenerApi) => {
        try {
            await listenerApi.dispatch(fetchRandomNeko()).unwrap();
        } catch (err) {
            console.error("Failed to fetch neko:", err);
        }
    }
});
