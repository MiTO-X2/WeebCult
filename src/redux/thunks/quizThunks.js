import {
  initializeQuiz,// <-- to start quiz
  setQuestionAnswers,// <-- to set possible answers
  submitAnswer,//<-- to submit user answer
  nextQuestion,//<-- to move to next question
  loadCurrentQuestion,//<-- to load current question
  timeExpired,//<-- to handle timer expiry
} from "/src/redux/slices/quizSlice.js";

import {
  addQuizResult,// <-- to add completed quiz to user stats
  updateUserStats,// <-- to persist updated stats to Firestore
} from "/src/redux/slices/userSlice.js";

import {
  saveUserLeaderboardEntry,// <-- to update user's leaderboard entry
} from "/src/redux/slices/leaderboardSlice.js";

/********************************************************************************
 * Utility: Generate 3 random wrong answers
 **********************************************************************/
function generateWrongAnswers(characters, correctAnswer, category) {
  const wrongSet = new Set();

  // This prevents issues when there are fewer than 4 characters.
  while (wrongSet.size < 3 && wrongSet.size < characters.length - 1) {
    const candidateChar = characters[Math.floor(Math.random() * characters.length)];
    const candidate = category === "name" ? candidateChar.name : candidateChar.role || "Unknown";
    if (candidate && candidate !== correctAnswer) {
      wrongSet.add(candidate);
    }
  }

  return Array.from(wrongSet);
}

/************************************************************
 * Helper: advance to next question + load + generate answers
 ************************************************************/
export function advanceQuestion() {
  return (dispatch, getState) => {
    dispatch(nextQuestion());
    dispatch(loadCurrentQuestion());

    const { quiz } = getState();
    const q = quiz.currentQuestion;
    if (!q) return;

    dispatch(setQuestionAnswers({
      correct: q.correct,
      wrong: generateWrongAnswers(quiz.characters, q.correct, quiz.category),
    }));
  };
}

/************************************************************
 * Finish quiz thunk: update stats + leaderboard + Firestore
 ************************************************************/
export function finishQuizThunk() {
  return async (dispatch, getState) => {
    const { quiz, user } = getState();

    const finalQuizResult = {
      score: quiz.score,
      total: quiz.questions.length,
      category: quiz.category,
      mode: quiz.mode,
      type: quiz.type,
      time: quiz.timeLimit,
      completedAt: Date.now(),
      animeId: quiz.animeId,
      animeTitle: quiz.animeTitle,
      animeImg: quiz.animeImg
    };

    dispatch(addQuizResult(finalQuizResult));

    const uid = user.uid;
    const newStats = [...user.stats.quizzes, finalQuizResult];

    dispatch(updateUserStats({ uid, stats: newStats }));

    const leaderboardData = {
      username: user.profile?.displayName || "Anonymous",
      bestScore: Math.max(user.stats.bestScore || 0, finalQuizResult.score),
      quizzesCompleted: newStats.length,
      lastUpdated: Date.now()
    };
    dispatch(saveUserLeaderboardEntry({ uid, leaderboardData }));
  };
}

/************************************************************
 * Start quiz thunk
 ************************************************************/
export function startQuizThunk({ characters, category, mode, type, anime, questionCount = 10 }) {
  const shuffled = [...characters].sort(() => Math.random() - 0.5);

  // Take only "questionCount" characters
  const selected = shuffled.slice(0, questionCount);

  return (dispatch) => {
    dispatch(initializeQuiz({ characters: selected, category, mode, type, anime }));
    dispatch(loadCurrentQuestion());

    const q = selected[0]; // first question
    const correctAnswer = category === "name" ? q.name : q.role;
    dispatch(
      setQuestionAnswers({
        correct: correctAnswer,
        wrong: generateWrongAnswers(selected, correctAnswer, category)
      })
    );
  };
}

/************************************************************
 * Answer clicked thunk
 ************************************************************/
export function answerThunk(answer) {
  return (dispatch, getState) => {
    dispatch(submitAnswer(answer));

    const { quiz } = getState();

    if (quiz.quizFinished) {
      dispatch(finishQuizThunk());
      return;
    }

    // Delay before advancing to next question
    setTimeout(() => { dispatch(advanceQuestion()); }, 20); // gives time for flash to appear
  };
}

/************************************************************
 * Timer expired thunk
 ************************************************************/
export function timerExpiredThunk() {
  return (dispatch, getState) => {
    dispatch(timeExpired());

    const { quiz } = getState();
    if (quiz.quizFinished) {
      dispatch(finishQuizThunk());
      return;
    }

    dispatch(advanceQuestion());
  };
}
