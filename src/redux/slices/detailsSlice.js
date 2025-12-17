/**********************************************************************
 * PURPOSE:
 *   - Store selected anime ID
 *   - Fetch characters and full anime details
 *   - Use promiseState for both
 **********************************************************************/

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAnimeCharacters, getAnimeById } from "/src/api/animeSource.js";

function makePromiseState() {
    return {
        promise: null,
        data: null,
        error: null
    };
}

const initialState = {
    selectedId: null,
    isOpen: false,
    details: { promiseState: makePromiseState() },
    characters: { promiseState: makePromiseState() },
    quizSettings: {                 // Store selected quiz options
        category: null,             // "Name" | "Role" | "VoiceActor"
        mode: null,                 // "Solo" | "1v1"
        type: null                  // "Best10" | "Best10 Timed" | "Best25" | "Best25 Timed"
    }
};

/************************************************************
 * Thunks
 ************************************************************/
export const loadAnimeDetails = createAsyncThunk(
    "details/loadAnimeDetails",
    async (id) => {
        const data = await getAnimeById(id);
        return data;
    }
);

export const loadAnimeCharacters = createAsyncThunk(
    "details/loadAnimeCharacters",
    async (id) => {
        const data = await getAnimeCharacters(id);
        return data;
    }
);

/************************************************************
 * Slice
 ************************************************************/
export const detailsSlice = createSlice({
    name: "details",
    initialState,
    reducers: {
        setSelectedAnimeId(state, action) {
            state.selectedId = action.payload;
            state.isOpen = !!action.payload; // open modal if an ID is set

            if (!action.payload) {
                // If closing modal, reset quiz settings
                state.quizSettings = { category: null, mode: null, type: null };
            }
        },
        setQuizCategory(state, action) {
            state.quizSettings.category = action.payload; // "Name" | "Role" | "VoiceActor"
        },
        setQuizMode(state, action) {
            state.quizSettings.mode = action.payload; // "Solo" | "1v1"
        },
        setQuizType(state, action) {
            state.quizSettings.type = action.payload; // "Best10" | "Best10 Timed" | "Best25" | "Best25 Timed"
        },
        resetDetails(state) {
                state.selectedId = null;
                state.details = { promiseState: makePromiseState() };
                state.characters = { promiseState: makePromiseState() };
                state.quizSettings = { category: null, mode: null, type: null };
            }
    },

    extraReducers: (builder) => {

        /* -------------------- DETAILS -------------------- */
        builder
            .addCase(loadAnimeDetails.pending, (state, action) => {
                const ps = state.details.promiseState;
                ps.promise = action.meta.requestId;
                ps.data = null;
                ps.error = null;
            })
            .addCase(loadAnimeDetails.fulfilled, (state, action) => {
                const ps = state.details.promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.data = action.payload;
                ps.error = null;
            })
            .addCase(loadAnimeDetails.rejected, (state, action) => {
                const ps = state.details.promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.data = null;
                ps.error = action.error;
            });

        /* ------------------- CHARACTERS ------------------- */
        builder
            .addCase(loadAnimeCharacters.pending, (state, action) => {
                const ps = state.characters.promiseState;
                ps.promise = action.meta.requestId;
                ps.data = null;
                ps.error = null;
            })
            .addCase(loadAnimeCharacters.fulfilled, (state, action) => {
                const ps = state.characters.promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.data = action.payload;
                ps.error = null;
            })
            .addCase(loadAnimeCharacters.rejected, (state, action) => {
                const ps = state.characters.promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.data = null;
                ps.error = action.error;
            });
    }
});

export const { 
    setSelectedAnimeId,
    setQuizCategory,
    setQuizMode,
    setQuizType,
    resetDetails } = detailsSlice.actions;
export default detailsSlice.reducer;
