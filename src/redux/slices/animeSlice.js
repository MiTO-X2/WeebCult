/***********************************************************************
 * PURPOSE:
 *   - Store anime search/trending/genre results
 *   - Keep promiseState for each category:
 *       search: { promiseState }
//       trending: { promiseState }
//       genres: { promiseState }
 *
 *   - Thunks call animeSource.js which uses Jikan API
 *   - Use resolvePromise pattern
 ***********************************************************************/

// TODO:
// 1. Import createSlice, createAsyncThunk
// 2. Import animeSource functions: searchAnime, getTopAnime, getGenres
// 3. initialState = {
//       search: { promiseState: { promise, data, error } },
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
