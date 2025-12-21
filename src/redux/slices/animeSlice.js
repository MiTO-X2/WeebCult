/***********************************************************************
 * PURPOSE:
 *   - Store anime search/trending/genre results
 *   - Keep promiseState for each category:
 *       search: { promiseState }
 *       trending: { promiseState }
 *       genres: { promiseState }
 *
 *   - Thunks call animeSource.js which uses Jikan API
 *   - Use resolvePromise pattern
 * 
 * ARCHITECTURE RULES:
 *   - Reducers = pure state transitions
 *   - Thunks = async fetches (resolvePromise logic)
 ***********************************************************************/

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchAnime, getTopAnime, getGenres, getAnimeByGenre } from '/src/api/animeSource.js';

/************* Helpers *************/
function makePromiseState() {
    return {
        promise: null,
        data: null,
        error: null
    };
}

const MAIN_GENRES = ["Action", "Comedy", "Slice of Life", "Fantasy"];

/************* Initial State *************/
const initialState = {
    appInitialized: false,
    search:   { promiseState: makePromiseState() },
    trending: { promiseState: makePromiseState(), loaded: false },
    allGenres: { promiseState: makePromiseState(), loaded: false },
    animeByGenre: {}, // e.g. { "Action": { promiseState }, "Comedy": { promiseState } }
    genreLists: [],    // The model pre-computed structure
    searchFilters: {
        query: "",
        selectedType: "",
        selectedStatus: "",
        selectedRating: "",
        selectedGenres: [],
        selectedOrderBy: "",
        typeOptions: ["TV", "Movie", "OVA"],
        statusOptions: ["Airing", "Complete", "Upcoming"],
        ratingOptions: ["G", "PG", "PG13", "R", "RX"],
        orderByOptions: ["Title", "Score", "Popularity"]
    }
};

/************* Selectors *************/
export const selectGenreLists = (state) => state.anime.genreLists;

/************* Thunks *************/
export const fetchSearch = createAsyncThunk(
  "anime/fetchSearch",
  async (_, { getState }) => {
    const { searchFilters, allGenres } = getState().anime;
    const genres = allGenres.promiseState.data || [];

    const genreIDs = searchFilters.selectedGenres
      .map(name => genres.find(g => g.name === name)?.id)
      .filter(Boolean);

    return searchAnime(searchFilters.query, {
      type: searchFilters.selectedType,
      status: searchFilters.selectedStatus,
      rating: searchFilters.selectedRating,
      genres: genreIDs,
      orderBy: searchFilters.selectedOrderBy
    });
  }
);

export const fetchTrending = createAsyncThunk(
  "anime/fetchTrending",
  async () => getTopAnime()
);

export const fetchAllGenres = createAsyncThunk(
  "anime/fetchAllGenres",
  async () => getGenres()
);

export const fetchAnimeByGenre = createAsyncThunk(
  "anime/fetchAnimeByGenre",
  async ({ genreID, genreName }) => {
    const data = await getAnimeByGenre(genreID);
    return { genreName, data };
  }
);

/************* Slice *************/
export const animeSlice = createSlice({
    name: 'anime',
    initialState,
    reducers: {
        appInitialized(state) {
            state.appInitialized = true;
        },
        setQuery(state, action) {
            state.searchFilters.query = action.payload;
        },
        setSelectedType(state, action) {
            state.searchFilters.selectedType = action.payload;
        },
        setSelectedStatus(state, action) {
            state.searchFilters.selectedStatus = action.payload;
        },
        setSelectedRating(state, action) {
            state.searchFilters.selectedRating = action.payload;
        },
        setSelectedGenres(state, action) {
            state.searchFilters.selectedGenres = action.payload;
        },
        setSelectedOrderBy(state, action) {
            state.searchFilters.selectedOrderBy = action.payload;
        }
    },
    
    extraReducers: (builder) => {
        
        /* -------- SEARCH -------- */
        builder
            .addCase(fetchSearch.pending, (state, action) => {
                state.search.promiseState = {
                promise: action.meta.requestId,
                data: null,
                error: null
                };
            })
            .addCase(fetchSearch.fulfilled, (state, action) => {
                const ps = state.search.promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.data = action.payload;
                ps.promise = null;
            })
            .addCase(fetchSearch.rejected, (state, action) => {
                const ps = state.search.promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.error = action.error;
                ps.promise = null;
            });

        /* -------- TRENDING -------- */
        builder
            .addCase(fetchTrending.pending, (state, action) => {
                state.trending.promiseState.promise = action.meta.requestId;
                state.trending.loaded = false;
            })
            .addCase(fetchTrending.fulfilled, (state, action) => {
                const ps = state.trending.promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.data = action.payload;
                ps.promise = null;
                state.trending.loaded = true;
            })
            .addCase(fetchTrending.rejected, (state, action) => {
                const ps = state.trending.promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.error = action.error;
                ps.promise = null;
            }); 
        
        /* -------- ALL GENRES -------- */
        builder
            .addCase(fetchAllGenres.pending, (state, action) => {
                state.allGenres.promiseState.promise = action.meta.requestId;
            })
            .addCase(fetchAllGenres.fulfilled, (state, action) => {
                const ps = state.allGenres.promiseState;
                if (ps.promise !== action.meta.requestId) return;

                ps.data = action.payload;
                ps.promise = null;
                state.allGenres.loaded = true;

                const mainGenres = action.payload.filter(g =>
                    MAIN_GENRES.includes(g.name)
                );

                state.genreLists = mainGenres.map(g => ({
                    label: g.name,
                    items: []
                }));
            })
            .addCase(fetchAllGenres.rejected, (state, action) => {
                const ps = state.allGenres.promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.error = action.error;
                ps.promise = null;
            });

        /* -------- ANIME BY GENRE -------- */
        builder
            .addCase(fetchAnimeByGenre.pending, (state, action) => {
                const { genreName } = action.meta.arg;
                state.animeByGenre[genreName] = {
                promiseState: {
                    promise: action.meta.requestId,
                    data: null,
                    error: null
                },
                loaded: false
                };
            })
            .addCase(fetchAnimeByGenre.fulfilled, (state, action) => {
                const { genreName, data } = action.payload;
                const ps = state.animeByGenre[genreName].promiseState;
                if (ps.promise !== action.meta.requestId) return;

                ps.data = data;
                ps.promise = null;
                state.animeByGenre[genreName].loaded = true;

                state.genreLists = state.genreLists.map(g =>
                    g.label === genreName ? { ...g, items: data } : g
                );
            })
            .addCase(fetchAnimeByGenre.rejected, (state, action) => {
                const { genreName } = action.meta.arg;
                const ps = state.animeByGenre[genreName].promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.error = action.error;
                ps.promise = null;
            });
    }
});


/************* Exports *************/
export const { 
    appInitialized,
    setQuery,
    setSelectedType,
    setSelectedStatus,
    setSelectedRating,
    setSelectedGenres,
    setSelectedOrderBy } = animeSlice.actions;
export default animeSlice.reducer;