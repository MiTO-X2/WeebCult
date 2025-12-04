/**********************************************************************
 * PURPOSE:
 *   - Store selected anime ID
 *   - Fetch characters and full anime details
 *   - Use promiseState for both
 **********************************************************************/

// TODO:
// 1. import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// 2. Import animeSource functions:
//       getAnimeCharacters, getAnimeById
//
// 3. initialState = {
//        selectedId: null,
//        details: { promiseState: {} },
//        characters: { promiseState: {} }
//    };
//
// 4. Thunks:
//       loadAnimeDetails(id)
//       loadAnimeCharacters(id)
//
// 5. reducers:
//       setSelectedAnimeId(state, action)
//
// 5. Export reducer & actions

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
    details: { promiseState: makePromiseState() },
    characters: { promiseState: makePromiseState() }
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
export const { setSelectedAnimeId } = selectedAnimeSlice.actions;
export default detailsSlice.reducer;
