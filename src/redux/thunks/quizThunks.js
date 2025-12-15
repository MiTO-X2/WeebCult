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
  let candidates;

  if (category === "name") {
    candidates = characters.map(c => c.name);
  } else if (category === "role") {
    const ROLE_OPTIONS = [
      "Main",
      "Supporting",
      "Antagonist",
      "Protagonist",
      "Minor",
      "Background",
      "Cameo"
    ];

    candidates = ROLE_OPTIONS;
  } else if (category === "voiceActor") {
    // Only take Japanese voice actors
    candidates = characters
      .map(c => c.voice_actors?.find(a => a.language === "Japanese")?.name)
      .filter(Boolean); // remove undefined
  }

  // Remove duplicates and the correct answer 
  const wrongCandidates = Array.from(new Set(candidates)).filter(c => c !== correctAnswer);

  // Shuffle and take up to 3
  const shuffled = wrongCandidates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
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

    // Update local stats first
    dispatch(addQuizResult(finalQuizResult));

    const uid = user.uid;
    const updatedUser = getState().user;
    const newStats = [...updatedUser.stats.quizzes];

    try {
      // Await Firestore update to ensure it succeeds
      await dispatch(updateUserStats({ uid, stats: newStats })).unwrap();

      const leaderboardData = {
        username: user.userData?.displayName || "Anonymous",
        bestScore: Math.max(user.stats.bestScore || 0, finalQuizResult.score),
        quizzesCompleted: newStats.length,
        lastUpdated: Date.now()
      };

      await dispatch(saveUserLeaderboardEntry({ uid, leaderboardData })).unwrap();
    } catch (err) {
      console.error("Failed to update stats or leaderboard:", err);
    }
  };
}

/************************************************************
 * Start quiz thunk
 ************************************************************/
export function startQuizThunk({ characters, category, mode, type, anime, questionCount = 10 }) {
    const filtered = characters.filter(c => category !== "voiceActor" || c.voice_actors?.some(a => a.language === "Japanese"));
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, questionCount);


    return (dispatch) => {
        dispatch(initializeQuiz({ characters: selected, category, mode, type, anime }));
        dispatch(loadCurrentQuestion());

        const q = selected[0]; // first question

        // Pick correct answer based on category
        let correctAnswer;
        if (category === "name") correctAnswer = q.name;
        else if (category === "role") correctAnswer = q.role;
        else if (category === "voiceActor") {
            correctAnswer = q.voice_actors?.find(a => a.language === "Japanese")?.name;
        }

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
