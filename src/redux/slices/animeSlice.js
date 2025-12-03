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
import { searchAnime, getTopAnime, getGenres } from '../../sources/animeSource';
import { resolvePromise } from '../../utils/reduxUtils';

// 3. Define initialState:
/************* 1. Hjälpfunktion: tomt promiseState *************/
function makePromiseState() {
    return {
        promise: null,
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
