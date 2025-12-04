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
import { searchAnime, getTopAnime, getGenres } from '/src/api/animeSource.js';


// 3. Define initialState:
/************* 1. Hjälpfunktion: tomt promiseState *************/
function makePromiseState() {
    return {
        promise: null,// kan vara requestId eller liknande
        data: null,
        error: null
    };
}

/************* 2. initialState *************/
const initialState = {
    search:   { promiseState: makePromiseState() },
    trending: { promiseState: makePromiseState() },
    genres:   { promiseState: makePromiseState() }
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

//fetchTrending()
// Hämta top / trending anime
export const fetchTrending = createAsyncThunk(
    'anime/fetchTrending',    
    async () => {
        const data = await getTopAnime();
        return data;
    }   
);

//fetchGenres()
// Hämta genre-lista
export const fetchGenres = createAsyncThunk(
    'anime/fetchGenres',    
    async () => {   
        const data = await getGenres();
        return data;
    }
);


//************************ */ 5. createSlice({*****************
export const animeSlice = createSlice({
    name: 'anime',// namn på slice
    initialState,
    reducers: {},
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
                  
            })
            .addCase(fetchSearch.rejected, (state, action) => {// när anropet misslyckas
                const promiseState = state.search.promiseState;
                // Kontrollera race condition
                if (promiseState.promise === action.meta.requestId) return;
                    promiseState.data = null;
                    promiseState.error = action.error; // sätt fel från action.error
                   
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
                
            })
            .addCase(fetchTrending.rejected, (state, action) => {// när anropet misslyckas
                const promiseState = state.trending.promiseState;
                // Kontrollera race condition
                if (promiseState.promise !== action.meta.requestId) return;
                    promiseState.data = null;
                    promiseState.error = action.error; // sätt fel från action.error
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
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                const promiseState = state.genres.promiseState;
                // Kontrollera race condition
                if (promiseState.promise !== action.meta.requestId) return;
                    promiseState.data = null;
                    promiseState.error = action.error;  
                
            }); 

            //...lägg till fler thunks här vid behov
    }
});


//************************ 6. Export reducer *****************/
export default animeSlice.reducer; // exportera reducer för store 

        



//initialState = {
//       search: { promiseState: { promise: null, data: null, error: null }},
//       trending: { promiseState: {} },
//       genres: { promiseState: {} }
//    }
//
// 4. Create thunks:
//       fetchSearch(query)
//       fetchTrending()
//       fetchGenres()
//
//    Each thunk should:
//       - call animeSource...
//       - return data (fulfilled)
//       - handle errors (rejected)
//
// 5. createSlice({
//       name: 'anime',
//       initialState,
//       reducers: {}
//    })
//
// 6. Export reducer
