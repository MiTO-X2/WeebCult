import { createSelector } from "@reduxjs/toolkit";

/**
 * Base selector
 */
export const selectLeaderboardEntries = state =>
  state.leaderboard.entries;

/**
 * Derived: sorted + ranked leaderboard
 */
export const selectRankedLeaderboard = createSelector(
  [selectLeaderboardEntries],
  entries =>
    [...entries]
      .sort(
        (a, b) =>
          b.bestScore - a.bestScore ||
          a.lastUpdated - b.lastUpdated
      )
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))
);

/**
 * Derived: current user's ranked entry
 */
export const selectUserRankedEntry = createSelector(
  [selectRankedLeaderboard, (_, uid) => uid],
  (ranked, uid) =>
    ranked.find(entry => entry.uid === uid) || null
);
