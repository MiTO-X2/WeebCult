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
// 1. import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// 2. Import animeSource functions: searchAnime, getTopAnime, getGenres
// 3. initialState = {
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
