// redux/thunks/searchThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSearch as fetchSearchSlice } from "../slices/animeSlice.js";
import { isValidURL } from "../../utils/urlHelpers.js";
import { traceMoeSearch } from "../../api/traceMoeSource.js";

export const fetchSearchWithTrace = createAsyncThunk(
    "anime/fetchSearchWithTrace",
    async (_, { getState, dispatch }) => {
        const { searchFilters } = getState().anime;
        let query = searchFilters.query;

        // If input is URL, detect anime via Trace.moe
        if (isValidURL(query)) {
            const detectedTitle = await traceMoeSearch(query);
            if (detectedTitle) {
                console.log("Trace.moe detected anime:", detectedTitle);
                query = detectedTitle;
            }
        }

        // Dispatch normal search with query (reusing existing fetchSearch thunk)
        return dispatch(fetchSearchSlice(query));
    }
);