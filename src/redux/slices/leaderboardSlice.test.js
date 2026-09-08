import { describe, it, expect } from 'vitest';
import leaderboardReducer, {
    openLeaderboard,
    closeLeaderboard,
    setLeaderboard,
    setUserLeaderboardEntry,
    setLeaderboardError,
    setLoading,
} from './leaderboardSlice';

const initialState = () => leaderboardReducer(undefined, { type: '@@INIT' });

const mockEntries = [
    { uid: 'user-1', displayName: 'Alice', totalPoints: 100 },
    { uid: 'user-2', displayName: 'Bob', totalPoints: 80 },
];

describe('initial state', () => {
    it('starts closed with empty entries', () => {
        const state = initialState();
        expect(state.entries).toEqual([]);
        expect(state.userEntry).toBeNull();
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.isOpen).toBe(false);
    });
});

describe('open/close', () => {
    it('opens the leaderboard', () => {
        const state = leaderboardReducer(initialState(), openLeaderboard());
        expect(state.isOpen).toBe(true);
    });

    it('closes the leaderboard', () => {
        let state = leaderboardReducer(initialState(), openLeaderboard());
        state = leaderboardReducer(state, closeLeaderboard());
        expect(state.isOpen).toBe(false);
    });
});

describe('setLeaderboard', () => {
    it('stores the entries array', () => {
        const state = leaderboardReducer(initialState(), setLeaderboard(mockEntries));
        expect(state.entries).toEqual(mockEntries);
    });

    it('replaces existing entries', () => {
        let state = leaderboardReducer(initialState(), setLeaderboard(mockEntries));
        state = leaderboardReducer(state, setLeaderboard([mockEntries[0]]));
        expect(state.entries).toHaveLength(1);
    });
});

describe('setUserLeaderboardEntry', () => {
    it('stores the current user entry', () => {
        const entry = { uid: 'user-1', displayName: 'Alice', totalPoints: 100 };
        const state = leaderboardReducer(initialState(), setUserLeaderboardEntry(entry));
        expect(state.userEntry).toEqual(entry);
    });

    it('can clear the user entry with null', () => {
        let state = leaderboardReducer(initialState(), setUserLeaderboardEntry({ uid: 'x' }));
        state = leaderboardReducer(state, setUserLeaderboardEntry(null));
        expect(state.userEntry).toBeNull();
    });
});

describe('setLeaderboardError', () => {
    it('stores an error', () => {
        const state = leaderboardReducer(initialState(), setLeaderboardError('Firestore error'));
        expect(state.error).toBe('Firestore error');
    });
});

describe('setLoading', () => {
    it('toggles loading state', () => {
        let state = leaderboardReducer(initialState(), setLoading(true));
        expect(state.loading).toBe(true);
        state = leaderboardReducer(state, setLoading(false));
        expect(state.loading).toBe(false);
    });
});