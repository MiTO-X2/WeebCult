import { describe, it, expect, vi, beforeEach } from 'vitest';
import nekoReducer, { fetchRandomNeko } from './nekoSlice';
import * as nekoSource from '../../api/nekoSource.js';

vi.mock('../../api/nekoSource.js');

const initialState = () => nekoReducer(undefined, { type: '@@INIT' });

beforeEach(() => {
    vi.clearAllMocks();
});

describe('initial state', () => {
    it('starts empty with no promise or error', () => {
        const state = initialState();
        expect(state.data).toBeNull();
        expect(state.promiseState).toEqual({ promise: null, error: null });
    });
});

describe('fetchRandomNeko thunk lifecycle', () => {
    it('stores an error when the API call fails', async () => {
        nekoSource.getRandomNeko.mockRejectedValue(new Error('Network down'));
        const dispatch = vi.fn();
        const getState = () => ({});

        await fetchRandomNeko()(dispatch, getState, undefined);

        const types = dispatch.mock.calls.map(([action]) => action.type);
        expect(types).toEqual([
        fetchRandomNeko.pending.type,
        fetchRandomNeko.rejected.type,
        ]);

        // Feed the dispatched actions through the reducer, like the store would
        let state = initialState();
        for (const [action] of dispatch.mock.calls) {
        state = nekoReducer(state, action);
        }
        expect(state.data).toBeNull();
        expect(state.promiseState.promise).toBeNull();
        expect(state.promiseState.error).toBeTruthy();
    });

    it('rejects with a message when no safe image is found', async () => {
        nekoSource.getRandomNeko.mockResolvedValue(null);
        const dispatch = vi.fn();

        await fetchRandomNeko()(dispatch, () => ({}), undefined);

        const rejected = dispatch.mock.calls
        .map(([action]) => action)
        .find(a => a.type === fetchRandomNeko.rejected.type);

        expect(rejected.payload).toBe('No safe neko image found');
    });

    it('stores the image URL on success', async () => {
        nekoSource.getRandomNeko.mockResolvedValue('https://nekos.best/neko/001.png');
        const dispatch = vi.fn();

        await fetchRandomNeko()(dispatch, () => ({}), undefined);

        const types = dispatch.mock.calls.map(([action]) => action.type);
        expect(types).toEqual([
        fetchRandomNeko.pending.type,
        fetchRandomNeko.fulfilled.type,
        ]);

        let state = initialState();
        for (const [action] of dispatch.mock.calls) {
        state = nekoReducer(state, action);
        }
        expect(state.data).toBe('https://nekos.best/neko/001.png');
        expect(state.promiseState.error).toBeNull();
    });
});

describe('clearNeko', () => {
    it('resets data, promise and error', () => {
        const dirty = {
        data: 'https://nekos.best/neko/001.png',
        promiseState: { promise: Promise.resolve(), error: 'boom' },
        };
        const state = nekoReducer(dirty, { type: 'neko/clearNeko' });
        expect(state.data).toBeNull();
        expect(state.promiseState).toEqual({ promise: null, error: null });
    });
});