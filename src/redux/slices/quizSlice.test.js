import { describe, it, expect, vi, afterEach } from 'vitest';
import quizReducer, {
    initializeQuiz,
    setQuestionAnswers,
    submitAnswer,
    nextQuestion,
    loadCurrentQuestion,
    timeExpired,
} from './quizSlice';

/* ---------------- Test fixtures ---------------- */

const mockAnime = {
  id: 20,
  title: 'Naruto',
  image: 'https://example.com/naruto.jpg',
};

const mockCharacters = [
  {
    id: 1,
    name: 'Naruto Uzumaki',
    image: 'naruto.jpg',
    role: 'Main',
    voice_actors: [
      { name: 'Maile Flanagan', language: 'English' },   // English first on purpose:
      { name: 'Junko Takeuchi', language: 'Japanese' },  // tests that find() locates Japanese
    ],
  },
  {
    id: 2,
    name: 'Sasuke Uchiha',
    image: 'sasuke.jpg',
    role: 'Main',
    voice_actors: [{ name: 'Noriaki Sugiyama', language: 'Japanese' }],
  },
  {
    id: 3,
    name: 'Sakura Haruno',
    image: 'sakura.jpg',
    role: 'Main',
    voice_actors: [{ name: 'Chie Nakamura', language: 'Japanese' }],
  },
];

/* ---------------- Helper ---------------- */

// Mimics what gamePresenter does: initialize, then load the first question
function startQuiz(overrides = {}) {
  const payload = {
    characters: mockCharacters,
    category: 'Name',
    mode: 'Solo',
    type: 'Best10',
    anime: mockAnime,
    ...overrides,
  };
  let state = quizReducer(undefined, initializeQuiz(payload));
  return quizReducer(state, loadCurrentQuestion());
}

afterEach(() => {
  vi.restoreAllMocks();
});

/* ---------------- Tests ---------------- */

describe('initial state', () => {
  it('starts inactive with zeroed progress', () => {
    const state = quizReducer(undefined, { type: '@@INIT' });
    expect(state.quizActive).toBe(false);
    expect(state.score).toBe(0);
    expect(state.questions).toEqual([]);
    expect(state.currentQuestion).toBeNull();
  });
});

describe('initializeQuiz', () => {
  it('stores the quiz settings', () => {
    const state = startQuiz({ category: 'Role', mode: '1v1', type: 'Best25 Timed' });
    expect(state.category).toBe('Role');
    expect(state.mode).toBe('1v1');
    expect(state.type).toBe('Best25 Timed');
  });

  it('stores the anime info for the score screen and leaderboard', () => {
    const state = startQuiz();
    expect(state.animeId).toBe(20);
    expect(state.animeTitle).toBe('Naruto');
    expect(state.animeImg).toBe('https://example.com/naruto.jpg');
  });

  it('activates the quiz and resets all progress', () => {
    const state = startQuiz();
    expect(state.quizActive).toBe(true);
    expect(state.quizFinished).toBe(false);
    expect(state.score).toBe(0);
    expect(state.player1).toBe(0);
    expect(state.player2).toBe(0);
    expect(state.turn).toBe('p1');
    expect(state.questionIndex).toBe(0);
    expect(state.selectedAnswer).toBeNull();
    expect(state.isCorrect).toBeNull();
  });

  it('builds one question per character, with name as the correct answer', () => {
    const state = startQuiz({ category: 'Name' });
    expect(state.questions).toHaveLength(3);
    expect(state.questions[0]).toEqual({
      id: 1,
      image: 'naruto.jpg',
      correct: 'Naruto Uzumaki',
      category: 'Name',
    });
  });

  it('uses the role as correct answer in Role category', () => {
    const state = startQuiz({ category: 'Role' });
    expect(state.questions[0].correct).toBe('Main');
  });

  it('uses the Japanese voice actor in VoiceActor category', () => {
    const state = startQuiz({ category: 'VoiceActor' });
    expect(state.questions[0].correct).toBe('Junko Takeuchi');
  });

  it('falls back to "Unknown" when a character has no role', () => {
    const chars = [{ id: 9, name: 'Mystery', image: 'x.jpg' }];
    const state = startQuiz({ characters: chars, category: 'Role' });
    expect(state.questions[0].correct).toBe('Unknown');
  });

  it('falls back to "Unknown" when no Japanese voice actor exists', () => {
    const chars = [{
      id: 9, name: 'X', image: 'x.jpg',
      voice_actors: [{ name: 'Some VA', language: 'English' }],
    }];
    const state = startQuiz({ characters: chars, category: 'VoiceActor' });
    expect(state.questions[0].correct).toBe('Unknown');
  });

  it('does NOT set currentQuestion — presenter must call loadCurrentQuestion', () => {
    const state = quizReducer(undefined, initializeQuiz({
      characters: mockCharacters, category: 'Name', mode: 'Solo', type: 'Best10',
    }));
    expect(state.currentQuestion).toBeNull();
  });
});

describe('setQuestionAnswers', () => {
  const payload = {
    correct: 'Naruto Uzumaki',
    wrong: ['Sasuke Uchiha', 'Sakura Haruno', 'Kakashi Hatake'],
  };

  it('contains exactly the correct answer plus the wrong ones', () => {
    const state = quizReducer(startQuiz(), setQuestionAnswers(payload));
    expect(state.answersShuffled).toHaveLength(4);
    expect([...state.answersShuffled].sort())
      .toEqual([payload.correct, ...payload.wrong].sort());
  });

  it('never drops the correct answer, even across many shuffles', () => {
    for (let i = 0; i < 20; i++) {
      const state = quizReducer(startQuiz(), setQuestionAnswers(payload));
      expect(state.answersShuffled).toContain('Naruto Uzumaki');
    }
  });

  it('shuffles deterministically when Math.random is mocked', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // j is always 0 in Fisher–Yates
    const state = quizReducer(startQuiz(), setQuestionAnswers(payload));
    expect(state.answersShuffled).toEqual([
      'Sasuke Uchiha', 'Sakura Haruno', 'Kakashi Hatake', 'Naruto Uzumaki',
    ]);
  });
});

describe('submitAnswer — Solo mode', () => {
  it('increments score and flags correct on a right answer', () => {
    const state = quizReducer(startQuiz(), submitAnswer('Naruto Uzumaki'));
    expect(state.score).toBe(1);
    expect(state.isCorrect).toBe(true);
    expect(state.selectedAnswer).toBe('Naruto Uzumaki');
  });

  it('leaves score unchanged on a wrong answer', () => {
    const state = quizReducer(startQuiz(), submitAnswer('Sasuke Uchiha'));
    expect(state.score).toBe(0);
    expect(state.isCorrect).toBe(false);
    expect(state.selectedAnswer).toBe('Sasuke Uchiha');
  });
});

describe('submitAnswer — 1v1 mode', () => {
  const start1v1 = () => startQuiz({ mode: '1v1' });

  it('awards the point to player 1 on their turn', () => {
    const state = quizReducer(start1v1(), submitAnswer('Naruto Uzumaki'));
    expect(state.player1).toBe(1);
    expect(state.player2).toBe(0);
  });

  it('switches the turn to player 2 after player 1 answers', () => {
    const state = quizReducer(start1v1(), submitAnswer('Naruto Uzumaki'));
    expect(state.turn).toBe('p2');
  });

  it('awards player 2 on their turn, then switches back to p1', () => {
    let state = quizReducer(start1v1(), submitAnswer('Naruto Uzumaki')); // p1 correct
    state = quizReducer(state, submitAnswer('Naruto Uzumaki'));          // p2 correct
    expect(state.player1).toBe(1);
    expect(state.player2).toBe(1);
    expect(state.turn).toBe('p1');
  });

  it('switches turn even on a wrong answer', () => {
    const state = quizReducer(start1v1(), submitAnswer('Wrong'));
    expect(state.player1).toBe(0);
    expect(state.turn).toBe('p2');
  });

  it('does not touch the solo score field', () => {
    const state = quizReducer(start1v1(), submitAnswer('Naruto Uzumaki'));
    expect(state.score).toBe(0);
  });
});

describe('nextQuestion', () => {
  it('advances the index and clears previous answer state', () => {
    let state = quizReducer(startQuiz(), setQuestionAnswers({
      correct: 'Naruto Uzumaki', wrong: ['a', 'b', 'c'],
    }));
    state = quizReducer(state, submitAnswer('Naruto Uzumaki'));
    state = quizReducer(state, nextQuestion());

    expect(state.questionIndex).toBe(1);
    expect(state.selectedAnswer).toBeNull();
    expect(state.isCorrect).toBeNull();
    expect(state.answersShuffled).toEqual([]);
  });

  it('finishes the quiz after the last question', () => {
    let state = startQuiz({ characters: mockCharacters.slice(0, 2) });
    state = quizReducer(state, nextQuestion()); // index 0 -> 1 (last)
    expect(state.quizFinished).toBe(false);
    state = quizReducer(state, nextQuestion()); // last answered -> finish
    expect(state.quizFinished).toBe(true);
    expect(state.quizActive).toBe(false);
    expect(state.questionIndex).toBe(1); // index does not run past the end
  });

  it('finishes immediately for a single-question quiz', () => {
    let state = startQuiz({ characters: [mockCharacters[0]] });
    state = quizReducer(state, nextQuestion());
    expect(state.quizFinished).toBe(true);
  });
});

describe('loadCurrentQuestion', () => {
  it('loads the question at the current index', () => {
    expect(startQuiz().currentQuestion.correct).toBe('Naruto Uzumaki');
  });

  it('loads the next question after nextQuestion', () => {
    let state = quizReducer(startQuiz(), nextQuestion());
    state = quizReducer(state, loadCurrentQuestion());
    expect(state.currentQuestion.correct).toBe('Sasuke Uchiha');
  });
});

describe('timeExpired', () => {
  it('marks the question incorrect in a timed solo quiz', () => {
    const state = quizReducer(startQuiz({ type: 'Best10 Timed' }), timeExpired());
    expect(state.isCorrect).toBe(false);
    expect(state.score).toBe(0);
  });

  it('clears any selected answer', () => {
    const base = { ...startQuiz({ type: 'Best10 Timed' }), selectedAnswer: 'Naruto Uzumaki' };
    const state = quizReducer(base, timeExpired());
    expect(state.selectedAnswer).toBeNull();
  });

  it('switches the turn in a timed 1v1 quiz', () => {
    const state = quizReducer(startQuiz({ mode: '1v1', type: 'Best25 Timed' }), timeExpired());
    expect(state.turn).toBe('p2');
  });

  it('does nothing in untimed quizzes', () => {
    const state = quizReducer(startQuiz({ type: 'Best10' }), timeExpired());
    expect(state.isCorrect).toBeNull();
    expect(state.turn).toBe('p1');
  });
});

describe('full quiz flow', () => {
  it('plays a complete solo quiz from start to finish', () => {
    let state = startQuiz({ characters: mockCharacters.slice(0, 2) });

    // Q1: correct answer
    state = quizReducer(state, submitAnswer('Naruto Uzumaki'));
    state = quizReducer(state, nextQuestion());
    state = quizReducer(state, loadCurrentQuestion());

    // Q2: wrong answer
    state = quizReducer(state, submitAnswer('Pikachu'));
    state = quizReducer(state, nextQuestion());

    expect(state.quizFinished).toBe(true);
    expect(state.quizActive).toBe(false);
    expect(state.score).toBe(1);
  });
});