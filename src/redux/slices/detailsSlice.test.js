import { describe, it, expect, vi, beforeEach } from 'vitest';
import detailsReducer, {
    setSelectedAnimeId,
    setQuizCategory,
    setQuizMode,
    setQuizType,
    resetDetails,
    loadAnimeDetails,
    loadAnimeCharacters,
} from './detailsSlice';
import * as animeSource from '/src/api/animeSource.js';

vi.mock('/src/api/animeSource.js');

const initialState = () => detailsReducer(undefined, { type: '@@INIT' });

beforeEach(() => {
    vi.clearAllMocks();
});

const mockDetails = { id: 20, title: 'Naruto', synopsis: 'Ninja stuff' };
const mockCharacters = [{ id: 1, name: 'Naruto Uzumaki' }];

async function runThunk(thunk, arg, state) {
    const dispatch = vi.fn();
    await thunk(arg)(dispatch, () => ({}), undefined);

    let newState = state;
    for (const [action] of dispatch.mock.calls) {
        newState = detailsReducer(newState, action);
    }
    return newState;
}

describe('initial state', () => {
    it('starts with no selection and closed modal', () => {
        const state = initialState();
        expect(state.selectedId).toBeNull();
        expect(state.isOpen).toBe(false);
        expect(state.quizSettings).toEqual({ category: null, mode: null, type: null });
    });
});

describe('setSelectedAnimeId', () => {
    it('opens the modal when an ID is set', () => {
        const state = detailsReducer(initialState(), setSelectedAnimeId(20));
        expect(state.selectedId).toBe(20);
        expect(state.isOpen).toBe(true);
    });

    it('closes the modal and resets quiz settings when ID is null', () => {
        let state = initialState();
        state = detailsReducer(state, setSelectedAnimeId(20));
        state = detailsReducer(state, setQuizCategory('Name'));
        state = detailsReducer(state, setQuizMode('Solo'));
        state = detailsReducer(state, setQuizType('Best10'));

        state = detailsReducer(state, setSelectedAnimeId(null));

        expect(state.selectedId).toBeNull();
        expect(state.isOpen).toBe(false);
        expect(state.quizSettings).toEqual({ category: null, mode: null, type: null });
    });

    it('closes the modal when ID is undefined', () => {
        let state = detailsReducer(initialState(), setSelectedAnimeId(20));
        state = detailsReducer(state, setSelectedAnimeId(undefined));
        expect(state.isOpen).toBe(false);
    });
});

describe('quiz settings reducers', () => {
    it('sets category, mode, and type', () => {
        let state = initialState();
        state = detailsReducer(state, setQuizCategory('VoiceActor'));
        state = detailsReducer(state, setQuizMode('1v1'));
        state = detailsReducer(state, setQuizType('Best25 Timed'));

        expect(state.quizSettings).toEqual({
        category: 'VoiceActor',
        mode: '1v1',
        type: 'Best25 Timed',
        });
    });
});

describe('resetDetails', () => {
    it('clears everything back to initial state', () => {
        // Build a "dirty" state directly (bypasses Immer freezing)
        const dirtyState = {
        selectedId: 20,
        isOpen: true,
        details: { promiseState: { promise: null, data: mockDetails, error: null } },
        characters: { promiseState: { promise: null, data: mockCharacters, error: null } },
        quizSettings: { category: 'Name', mode: 'Solo', type: 'Best10' },
        };

        const state = detailsReducer(dirtyState, resetDetails());

        expect(state.selectedId).toBeNull();
        expect(state.details.promiseState).toEqual({ promise: null, data: null, error: null });
        expect(state.characters.promiseState).toEqual({ promise: null, data: null, error: null });
        expect(state.quizSettings).toEqual({ category: null, mode: null, type: null });
    });
});

describe('loadAnimeDetails', () => {
    it('stores details on success', async () => {
        animeSource.getAnimeById.mockResolvedValue(mockDetails);

        const state = await runThunk(loadAnimeDetails, 20, initialState());

        expect(state.details.promiseState.data).toEqual(mockDetails);
        expect(state.details.promiseState.error).toBeNull();
    });

    it('stores error on failure', async () => {
        animeSource.getAnimeById.mockRejectedValue(new Error('Not found'));

        const state = await runThunk(loadAnimeDetails, 999, initialState());

        expect(state.details.promiseState.error).toBeTruthy();
        expect(state.details.promiseState.data).toBeNull();
    });

    it('ignores stale responses', () => {
    let state = initialState();

    state = detailsReducer(state, {
        type: loadAnimeDetails.pending.type,
        meta: { requestId: 'request-B' },
    });

    state = detailsReducer(state, {
        type: loadAnimeDetails.fulfilled.type,
        payload: mockDetails,
        meta: { requestId: 'request-A' },
    });

    expect(state.details.promiseState.data).toBeNull();
    expect(state.details.promiseState.promise).toBe('request-B');
    });
});

describe('loadAnimeCharacters', () => {
    it('stores characters on success', async () => {
        animeSource.getAnimeCharacters.mockResolvedValue(mockCharacters);

        const state = await runThunk(loadAnimeCharacters, 20, initialState());

        expect(state.characters.promiseState.data).toEqual(mockCharacters);
    });

    it('stores error on failure', async () => {
        animeSource.getAnimeCharacters.mockRejectedValue(new Error('Network error'));

        const state = await runThunk(loadAnimeCharacters, 20, initialState());

        expect(state.characters.promiseState.error).toBeTruthy();
    });
});