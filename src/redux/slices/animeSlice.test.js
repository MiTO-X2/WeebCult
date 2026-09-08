import { describe, it, expect, vi, beforeEach } from 'vitest';
import animeReducer, {
    appInitialized,
    setQuery,
    setSelectedType,
    setSelectedStatus,
    setSelectedRating,
    setSelectedGenres,
    setSelectedOrderBy,
    fetchSearch,
    fetchTrending,
    fetchAllGenres,
    fetchAnimeByGenre,
    selectGenreLists,
} from './animeSlice';
import * as animeSource from '/src/api/animeSource.js';

vi.mock('/src/api/animeSource.js');

const initialState = () => animeReducer(undefined, { type: '@@INIT' });

beforeEach(() => {
    vi.clearAllMocks();
});

/* ---------------- Fixtures ---------------- */

const mockGenres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Comedy' },
    { id: 4, name: 'Fantasy' },
    { id: 10, name: 'Horror' },  
];

const mockAnimeList = [
    { id: 20, title: 'Naruto' },
    { id: 21, title: 'One Piece' },
];

/* ---------------- Helper: dispatch thunk and feed actions through reducer ---------------- */

async function runThunk(thunk, thunkArg, getState, state) {
    const dispatch = vi.fn();
    await thunk(thunkArg)(dispatch, getState, undefined);

    let newState = state;
    for (const [action] of dispatch.mock.calls) {
        newState = animeReducer(newState, action);
    }
    return { state: newState, dispatchedActions: dispatch.mock.calls.map(([a]) => a) };
}

/* ---------------- Tests ---------------- */

describe('initial state', () => {
    it('starts uninitialized with empty promise states', () => {
        const state = initialState();
        expect(state.appInitialized).toBe(false);
        expect(state.search.promiseState).toEqual({ promise: null, data: null, error: null });
        expect(state.trending.loaded).toBe(false);
        expect(state.allGenres.loaded).toBe(false);
        expect(state.animeByGenre).toEqual({});
        expect(state.genreLists).toEqual([]);
    });

    it('has default search filters', () => {
        const { searchFilters } = initialState();
        expect(searchFilters.query).toBe('');
        expect(searchFilters.selectedType).toBe('');
        expect(searchFilters.selectedGenres).toEqual([]);
        expect(searchFilters.typeOptions).toEqual(['TV', 'Movie', 'OVA']);
    });
});

describe('filter reducers', () => {
    it('sets the search query', () => {
        const state = animeReducer(initialState(), setQuery('naruto'));
        expect(state.searchFilters.query).toBe('naruto');
    });

    it('sets type, status, rating, orderBy', () => {
        let state = initialState();
        state = animeReducer(state, setSelectedType('TV'));
        state = animeReducer(state, setSelectedStatus('Airing'));
        state = animeReducer(state, setSelectedRating('PG13'));
        state = animeReducer(state, setSelectedOrderBy('Score'));

        expect(state.searchFilters.selectedType).toBe('TV');
        expect(state.searchFilters.selectedStatus).toBe('Airing');
        expect(state.searchFilters.selectedRating).toBe('PG13');
        expect(state.searchFilters.selectedOrderBy).toBe('Score');
    });

    it('sets selected genres', () => {
        const state = animeReducer(initialState(), setSelectedGenres(['Action', 'Comedy']));
        expect(state.searchFilters.selectedGenres).toEqual(['Action', 'Comedy']);
    });
});

describe('appInitialized', () => {
    it('marks the app as initialized', () => {
        const state = animeReducer(initialState(), appInitialized());
        expect(state.appInitialized).toBe(true);
    });
});

describe('fetchSearch', () => {
    it('stores search results on success', async () => {
        animeSource.searchAnime.mockResolvedValue(mockAnimeList);
        const getState = () => ({ anime: initialState() });

        const { state } = await runThunk(fetchSearch, undefined, getState, initialState());

        expect(state.search.promiseState.data).toEqual(mockAnimeList);
        expect(state.search.promiseState.promise).toBeNull();
        expect(state.search.promiseState.error).toBeNull();
    });

    it('maps genre names to IDs before calling the API', async () => {
    animeSource.searchAnime.mockResolvedValue([]);

    const base = initialState();
    const state = {
        ...base,
        searchFilters: { ...base.searchFilters, selectedGenres: ['Action', 'Comedy'] },
        allGenres: {
        promiseState: { promise: null, data: mockGenres, error: null },
        loaded: true,
        },
    };

    const getState = () => ({ anime: state });
    await runThunk(fetchSearch, undefined, getState, state);

    expect(animeSource.searchAnime).toHaveBeenCalledWith('', expect.objectContaining({
        genres: [1, 2],  // Action=1, Comedy=2
    }));
    });

    it('filters out genre names that have no matching ID', async () => {
    animeSource.searchAnime.mockResolvedValue([]);

    const base = initialState();
    const state = {
        ...base,
        searchFilters: { ...base.searchFilters, selectedGenres: ['Action', 'NonExistent'] },
        allGenres: {
        promiseState: { promise: null, data: mockGenres, error: null },
        loaded: true,
        },
    };

    const getState = () => ({ anime: state });
    await runThunk(fetchSearch, undefined, getState, state);

    expect(animeSource.searchAnime).toHaveBeenCalledWith('', expect.objectContaining({
        genres: [1],  // only Action found
    }));
    });

    it('stores error on failure', async () => {
        animeSource.searchAnime.mockRejectedValue(new Error('API down'));
        const getState = () => ({ anime: initialState() });

        const { state } = await runThunk(fetchSearch, undefined, getState, initialState());

        expect(state.search.promiseState.error).toBeTruthy();
        expect(state.search.promiseState.data).toBeNull();
    });

    it('ignores stale responses (race condition guard)', async () => {
    const base = initialState();
    let state = {
        ...base,
        search: {
        ...base.search,
        promiseState: { ...base.search.promiseState, promise: 'request-B' },
        },
    };

    // A stale fulfilled action from request A arrives while B is current
    const staleAction = {
        type: fetchSearch.fulfilled.type,
        payload: mockAnimeList,
        meta: { requestId: 'request-A' },
    };
    state = animeReducer(state, staleAction);

    // Data should NOT be updated
    expect(state.search.promiseState.data).toBeNull();
    expect(state.search.promiseState.promise).toBe('request-B');
    });
});

describe('fetchTrending', () => {
    it('stores trending anime and marks loaded', async () => {
        animeSource.getTopAnime.mockResolvedValue(mockAnimeList);

        const { state } = await runThunk(fetchTrending, undefined, () => ({}), initialState());

        expect(state.trending.promiseState.data).toEqual(mockAnimeList);
        expect(state.trending.loaded).toBe(true);
    });

    it('sets loaded=false while pending', async () => {
        let state = initialState();
        const pendingAction = {
        type: fetchTrending.pending.type,
        meta: { requestId: 'req-1' },
        };
        state = animeReducer(state, pendingAction);

        expect(state.trending.loaded).toBe(false);
        expect(state.trending.promiseState.promise).toBe('req-1');
    });
});

describe('fetchAllGenres', () => {
    it('stores genres and builds genreLists from MAIN_GENRES only', async () => {
        animeSource.getGenres.mockResolvedValue(mockGenres);

        const { state } = await runThunk(fetchAllGenres, undefined, () => ({}), initialState());

        expect(state.allGenres.promiseState.data).toEqual(mockGenres);
        expect(state.allGenres.loaded).toBe(true);

        // Horror is not in MAIN_GENRES, so excluded from genreLists
        expect(state.genreLists).toEqual([
        { label: 'Action', items: [] },
        { label: 'Comedy', items: [] },
        { label: 'Fantasy', items: [] },
        ]);
    });
});

describe('fetchAnimeByGenre', () => {
    it('stores anime under the genre name and updates genreLists', async () => {
        animeSource.getAnimeByGenre.mockResolvedValue(mockAnimeList);

        const base = initialState();
        const state = {
            ...base,
            genreLists: [
            { label: 'Action', items: [] },
            { label: 'Comedy', items: [] },
            ],
        };

        const { state: newState } = await runThunk(
            fetchAnimeByGenre,
            { genreID: 1, genreName: 'Action' },
            () => ({}),
            state
        );

        expect(newState.animeByGenre['Action'].promiseState.data).toEqual(mockAnimeList);
        expect(newState.animeByGenre['Action'].loaded).toBe(true);

        // genreLists updated for Action only
        expect(newState.genreLists).toEqual([
            { label: 'Action', items: mockAnimeList },
            { label: 'Comedy', items: [] },
        ]);
    });

    it('initializes genre entry on pending', () => {
        let state = initialState();
        const pendingAction = {
        type: fetchAnimeByGenre.pending.type,
        meta: { requestId: 'req-1', arg: { genreName: 'Action' } },
        };
        state = animeReducer(state, pendingAction);

        expect(state.animeByGenre['Action']).toEqual({
        promiseState: { promise: 'req-1', data: null, error: null },
        loaded: false,
        });
    });
});

describe('selectGenreLists', () => {
    it('returns genreLists from state', () => {
        const state = { anime: { genreLists: [{ label: 'Action', items: [] }] } };
        expect(selectGenreLists(state)).toEqual([{ label: 'Action', items: [] }]);
    });
});