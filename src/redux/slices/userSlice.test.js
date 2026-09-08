import { describe, it, expect } from 'vitest';
import userReducer, {
    setUid,
    clearUser,
    setUserData,
    setReady,
    setStatsFromDB,
    addQuizResult,
} from './userSlice';

/* ---------------- Fixtures ---------------- */

const makeQuiz = (score, extra = {}) => ({
    score,
    animeTitle: 'Naruto',
    category: 'Name',
    mode: 'Solo',
    ...extra,
});

const loggedInState = () => {
    let state = userReducer(undefined, { type: '@@INIT' });
    state = userReducer(state, setUid('user-123'));
    state = userReducer(state, setUserData({ displayName: 'Sakura' }));
    state = userReducer(state, setReady(true));
    return state;
};

/* ---------------- Tests ---------------- */

describe('initial state', () => {
    it('starts logged out and not ready', () => {
        const state = userReducer(undefined, { type: '@@INIT' });
        expect(state.uid).toBeUndefined();
        expect(state.userData).toBeUndefined();
        expect(state.stats).toEqual({ quizzes: [], totalQuizzesCompleted: 0, totalPoints: 0 });
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.ready).toBe(false);
    });
});

describe('setUid / setUserData / setReady', () => {
    it('stores the uid on login', () => {
        const state = userReducer(undefined, setUid('user-123'));
        expect(state.uid).toBe('user-123');
    });

    it('stores the Firestore user document', () => {
        const state = userReducer(undefined, setUserData({ displayName: 'Sakura' }));
        expect(state.userData).toEqual({ displayName: 'Sakura' });
    });

    it('marks the auth listener as ready', () => {
        const state = userReducer(undefined, setReady(true));
        expect(state.ready).toBe(true);
    });
});

describe('clearUser', () => {
    it('resets everything on logout but keeps ready true', () => {
        let state = loggedInState();
        state = userReducer(state, addQuizResult(makeQuiz(7)));
        state = userReducer(state, clearUser());

        expect(state.uid).toBeNull();
        expect(state.userData).toBeNull();
        expect(state.stats).toEqual({ quizzes: [], totalQuizzesCompleted: 0 });
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.ready).toBe(true); // auth listener already fired, still ready
    });
});

describe('setStatsFromDB', () => {
    it('loads stats from Firestore', () => {
        const fromDB = {
        quizzes: [makeQuiz(9), makeQuiz(5)],
        totalQuizzesCompleted: 2,
        totalPoints: 14,
        };
        const state = userReducer(undefined, setStatsFromDB(fromDB));
        expect(state.stats).toEqual(fromDB);
    });

    it('fills in defaults for missing fields', () => {
        const state = userReducer(undefined, setStatsFromDB({}));
        expect(state.stats).toEqual({ quizzes: [], totalQuizzesCompleted: 0, totalPoints: 0 });
    });
});

describe('addQuizResult', () => {
    it('adds the first quiz and counts it', () => {
        const state = userReducer(undefined, addQuizResult(makeQuiz(7)));
        expect(state.stats.quizzes).toHaveLength(1);
        expect(state.stats.quizzes[0].score).toBe(7);
        expect(state.stats.totalQuizzesCompleted).toBe(1);
    });

    it('accumulates total points', () => {
        let state = userReducer(undefined, addQuizResult(makeQuiz(7)));
        state = userReducer(state, addQuizResult(makeQuiz(3)));
        expect(state.stats.totalPoints).toBe(10);
        expect(state.stats.totalQuizzesCompleted).toBe(2);
    });

    it('keeps the highest-scoring quiz at index 0', () => {
        let state = userReducer(undefined, addQuizResult(makeQuiz(9)));
        state = userReducer(state, addQuizResult(makeQuiz(3)));
        state = userReducer(state, addQuizResult(makeQuiz(5)));

        expect(state.stats.quizzes.map(q => q.score)).toEqual([9, 5, 3]);
    });

    it('promotes a new quiz to index 0 when it beats the highest score', () => {
        let state = userReducer(undefined, addQuizResult(makeQuiz(5)));
        state = userReducer(state, addQuizResult(makeQuiz(9)));

        expect(state.stats.quizzes.map(q => q.score)).toEqual([9, 5]);
    });

    it('does not promote on a tie (new quiz goes after the highest)', () => {
        let state = userReducer(undefined, addQuizResult(makeQuiz(5, { animeTitle: 'First' })));
        state = userReducer(state, addQuizResult(makeQuiz(5, { animeTitle: 'Second' })));

        expect(state.stats.quizzes[0].animeTitle).toBe('First');
        expect(state.stats.quizzes[1].animeTitle).toBe('Second');
    });

    it('caps the stored quizzes at 10', () => {
        let state = userReducer(undefined, { type: '@@INIT' });
        for (let i = 0; i < 15; i++) {
        state = userReducer(state, addQuizResult(makeQuiz(i)));
        }
        expect(state.stats.quizzes).toHaveLength(10);
        expect(state.stats.totalQuizzesCompleted).toBe(15); // counter is NOT capped
    });

    it('keeps the highest score at index 0 even when the list overflows', () => {
        let state = userReducer(undefined, addQuizResult(makeQuiz(100)));
        for (let i = 0; i < 12; i++) {
        state = userReducer(state, addQuizResult(makeQuiz(i)));
        }
        expect(state.stats.quizzes[0].score).toBe(100);
        expect(state.stats.quizzes).toHaveLength(10);
    });
});