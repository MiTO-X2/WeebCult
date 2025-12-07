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

// TODO:
// 1.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 2. Import animeSource functions: searchAnime, getTopAnime, getGenres
import { searchAnime, getTopAnime, getGenres, getAnimeByGenre } from '/src/api/animeSource.js';


// 3. Define initialState:
/************* 1. Hjälpfunktion: tomt promiseState *************/
function makePromiseState() {
    return {
        promise: null,// kan vara requestId eller liknande
        data: null,
        error: null
    };
}

const MAIN_GENRES = ["Action", "Comedy", "Slice of Life", "Fantasy"];

/************* 2. initialState *************/
const initialState = {
    search:   { promiseState: makePromiseState() },
    trending: { promiseState: makePromiseState() },
    allGenres: { promiseState: makePromiseState() },
    genres:   { promiseState: makePromiseState() },
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
        statusOptions: ["Airing", "Completed", "Upcoming"],
        ratingOptions: ["G", "PG", "PG-13", "R", "R+"],
        orderByOptions: ["Title", "Score", "Popularity"]
    }
};


// ************************4. Create thunks:**********
// Sök anime baserat på namn (query)
export const fetchSearch = createAsyncThunk(
    'anime/fetchSearch',    
    async (query) => {
        // query kan vara tom / null, hantera det uppåt i presenter vid behov
        const data = await searchAnime(query);
        return data;// blir action.payload i fulfilled
    }   
);

//fetch trending/top anime
export const fetchTrending = createAsyncThunk(
    'anime/fetchTrending',    
    async () => {
        const data = await getTopAnime();
        return data;
    }   
);

// All genres (for header filter)
export const fetchAllGenres = createAsyncThunk(
    'anime/fetchAllGenres',
    async () => getGenres()  // all genres, no filtering
);

// Fetch list of genres (metadata only)
export const fetchGenres = createAsyncThunk(
    'anime/fetchGenres',    
    async () => {   
        const data = await getGenres();
        // Filter only MAIN_GENRES here to move business logic into model layer
        return data.filter((g) => MAIN_GENRES.includes(g.name));
    }
);

// Fetch anime by a specific genre (for main page rows)
export const fetchAnimeByGenre = createAsyncThunk(
    'anime/fetchAnimeByGenre',
    async ({ genreID, genreName }) => {
        const data = await getAnimeByGenre(genreID);
        return { genreName, data };
    }
);


//************************ */ 5. createSlice({*****************
export const animeSlice = createSlice({
    name: 'anime',// namn på slice
    initialState,
    reducers: {
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
        // Inga vanliga reducers behövs just nu
        // all state hanteras via thunks och promiseState
    
    extraReducers: (builder) => {
        
        // Hantera fetchSearch, för att uppdatera search.promiseState
        builder
            .addCase(fetchSearch.pending, (state, action) => {// när anropet påbörjas
                const promiseState = state.search.promiseState;
                promiseState.promise = action.meta.requestId; // sätt promise till requestId
                promiseState.data = null;
                promiseState.error = null;
            })
            .addCase(fetchSearch.fulfilled, (state, action) => {// när anropet lyckas
                const promiseState = state.search.promiseState;
                // Kontrollera race condition
                if (promiseState.promise !== action.meta.requestId) return; 
                    promiseState.data = action.payload; // sätt data från payload
                    promiseState.error = null;
                    promiseState.promise = null;

                    // Reset filters after search
                    state.searchFilters.query = "";
                    state.searchFilters.selectedType = "";
                    state.searchFilters.selectedStatus = "";
                    state.searchFilters.selectedRating = "";
                    state.searchFilters.selectedGenres = [];
                    state.searchFilters.selectedOrderBy = "";
            })
            .addCase(fetchSearch.rejected, (state, action) => {// när anropet misslyckas
                const promiseState = state.search.promiseState;
                // Kontrollera race condition
                if (promiseState.promise !== action.meta.requestId) return;
                    promiseState.data = null;
                    promiseState.error = action.error; // sätt fel från action.error
                    promiseState.promise = null;
            });


        // Hantera fetchTrending, för att uppdatera trending.promiseState  
        builder
            .addCase(fetchTrending.pending, (state, action) => {// när anropet påbörjas
                const promiseState = state.trending.promiseState;
                promiseState.promise = action.meta.requestId; // sätt promise till requestId
                promiseState.data = null;
                promiseState.error = null; 
            })
            .addCase(fetchTrending.fulfilled, (state, action) => {// när anropet lyckas
                const promiseState = state.trending.promiseState;
                // Kontrollera race condition
                if (promiseState.promise !== action.meta.requestId) return;
                    promiseState.data = action.payload; // sätt data från payload
                    promiseState.error = null;
                    promiseState.promise = null;
            })
            .addCase(fetchTrending.rejected, (state, action) => {// när anropet misslyckas
                const promiseState = state.trending.promiseState;
                // Kontrollera race condition
                if (promiseState.promise !== action.meta.requestId) return;
                    promiseState.data = null;
                    promiseState.error = action.error; // sätt fel från action.error
                    promiseState.promise = null;
            }); 
        
        // -------- ALL GENRES (HEADER) --------
        builder
            .addCase(fetchAllGenres.pending, (state, action) => {
                const ps = state.allGenres.promiseState;
                ps.promise = action.meta.requestId;
                ps.data = null;
                ps.error = null;
            })
            .addCase(fetchAllGenres.fulfilled, (state, action) => {
                const ps = state.allGenres.promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.data = action.payload;
                ps.error = null;
                ps.promise = null;
            })
            .addCase(fetchAllGenres.rejected, (state, action) => {
                const ps = state.allGenres.promiseState;
                if (ps.promise !== action.meta.requestId) return;
                ps.data = null;
                ps.error = action.error;
                ps.promise = null;
            });

        // Hantera fetchGenres, för att uppdatera genres.promiseState
        builder
            .addCase(fetchGenres.pending, (state, action) => {
                const promiseState = state.genres.promiseState;
                promiseState.promise = action.meta.requestId;
                promiseState.data = null;
                promiseState.error = null;
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                const promiseState = state.genres.promiseState;
                // Kontrollera race condition
                if (promiseState.promise !== action.meta.requestId) return;
                    promiseState.data = action.payload;
                    promiseState.error = null;
                    promiseState.promise = null;
                    
                    // Bygg genreLists baserat på hämtade genres och ev. redan laddade animeByGenre
                    state.genreLists = action.payload.map(g => ({
                        label: g.name,// genre namn som label
                        // Hämta anime-listan för genren om den finns, annars tom array
                        items: state.animeByGenre[g.name]?.promiseState.data || []
                    }));

            })
            .addCase(fetchGenres.rejected, (state, action) => {
                const promiseState = state.genres.promiseState;
                // Kontrollera race condition
                if (promiseState.promise !== action.meta.requestId) return;
                    promiseState.data = null;
                    promiseState.error = action.error;  
                    promiseState.promise = null; 
            }); 

                    // ------------------ GENRE-SPECIFIC ANIME ------------------
        builder
            .addCase(fetchAnimeByGenre.pending, (state, action) => {
                const { genreName } = action.meta.arg;
                if (!state.animeByGenre[genreName]){
                     state.animeByGenre[genreName] = { promiseState: makePromiseState() };
                }

                const ps = state.animeByGenre[genreName].promiseState;
                ps.promise = action.meta.requestId;
                ps.data = null;
                ps.error = null;
            })

            // Hantera lyckad fetchAnimeByGenre
            .addCase(fetchAnimeByGenre.fulfilled, (state, action) => {
                const { genreName, data } = action.payload;
                if (!state.animeByGenre[genreName]) {
                    state.animeByGenre[genreName] = { promiseState: makePromiseState() };
                }

                const ps = state.animeByGenre[genreName].promiseState;
                if (ps.promise !== action.meta.requestId) return;
                
                ps.data = data;
                ps.error = null;
                ps.promise = null;

                // Rebuild genreLists to ensure consistency
                if(state.genres.promiseState.data){// kontrollera att genres är laddade
                    state.genreLists = state.genres.promiseState.data.map(g => ({// för varje genre
                        label: g.name,// sätt label
                        items: state.animeByGenre[g.name]?.promiseState.data || []// hämta anime-listan eller tom array
                    }));
                }
            })

            // Hantera fel vid fetchAnimeByGenre
            .addCase(fetchAnimeByGenre.rejected, (state, action) => {
                const { genreName } = action.meta.arg;
                if (!state.animeByGenre[genreName]){
                     state.animeByGenre[genreName] = { promiseState: makePromiseState() };
                }
                // Hämta rätt promiseState för genren
                const ps = state.animeByGenre[genreName].promiseState;
                if (ps.promise !== action.meta.requestId) return;

                ps.data = null;
                ps.error = action.error;
                ps.promise = null;
            });

            //...lägg till fler thunks här vid behov
    }
});


//************************ 6. Export reducer *****************/
export const { 
    setQuery,
    setSelectedType,
    setSelectedStatus,
    setSelectedRating,
    setSelectedGenres,
    setSelectedOrderBy } = animeSlice.actions;
export default animeSlice.reducer; // exportera reducer för store 