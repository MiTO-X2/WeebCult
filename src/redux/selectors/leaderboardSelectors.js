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
        (a, b) => {
          const pointsDiff = (b.totalPoints || 0) - (a.totalPoints || 0);
          if (pointsDiff !== 0) return pointsDiff;

          // Convert lastUpdated to numbers if needed
          return (a.lastUpdated || 0) - (b.lastUpdated || 0);
        })
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
