/**********************************************************************
 * PURPOSE:
 *   - Central place for memoized selectors using reselect
 *   - Extracts computed values from store
 **********************************************************************/

// TODO:
// 1. Import createSelector from reselect
//
// 2. Examples:
//       export const selectUser = (state) => state.user;
//       export const selectAnimeSearch = (state) => state.anime.search;
//
// 3. Memoized selectors:
//       export const selectTop5Trending = createSelector(
//           (state) => state.anime.trending.promiseState.data,
//           (data) => data ? data.slice(0, 5) : []
//       );
