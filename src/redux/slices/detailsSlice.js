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
        category: null,             // "name" | "age"
        mode: null,                 // "solo" | "1v1"
        type: null                  // "best10" | "timed"
    }
};

/************************************************************
 * 1. Thunks
 ************************************************************/

// Hämtar all anime information från anime id
export const loadAnimeDetails = createAsyncThunk(
    "details/loadAnimeDetails",
    async (id) => {
        const data = await getAnimeById(id);
        return data;
    }
);

// Hämtar alla karaktärer från anime id
export const loadAnimeCharacters = createAsyncThunk(
    "details/loadAnimeCharacters",
    async (id) => {
        const data = await getAnimeCharacters(id);
        return data;
    }
);

/************************************************************
 * 2. Slice
 ************************************************************/
export const detailsSlice = createSlice({
    name: "details",
    initialState,
    reducers: {
        setSelectedAnimeId(state, action) {
            state.selectedId = action.payload;
            state.isOpen = !!action.payload; // open modal if an ID is set
        },
        setQuizCategory(state, action) {
            state.quizSettings.category = action.payload; // "name" | "age"
        },
        setQuizMode(state, action) {
            state.quizSettings.mode = action.payload; // "solo" | "1v1"
        },
        setQuizType(state, action) {
            state.quizSettings.type = action.payload; // "best10" | "timed"
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

/************************************************************
 * 3. Exports
 ************************************************************/
export const { 
    setSelectedAnimeId,
    setQuizCategory,
    setQuizMode,
    setQuizType,
    resetDetails } = detailsSlice.actions;
export default detailsSlice.reducer;
