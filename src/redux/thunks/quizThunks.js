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
  updateUserStatsAction,// <-- to persist updated stats to Firestore
} from "/src/redux/slices/userSlice.js";

import {
  saveUserLeaderboardEntryAction,// <-- to update user's leaderboard entry
} from "/src/redux/slices/leaderboardSlice.js";

/********************************************************************************
 * Utility: Generate 3 random wrong answers
 **********************************************************************/
function generateWrongAnswers(characters, correctAnswer, category) {
  let candidates;

  if (category === "Name") {
    candidates = characters.map(c => c.name);
  } else if (category === "Role") {
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
  } else if (category === "VoiceActor") {
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

    if (!user.uid) return;

    // Determine score depending on mode
    let finalScore = quiz.mode === "Solo" ? quiz.score : quiz.player1;

    const finalQuizResult = {
      score: finalScore,
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

    // Update local Redux stats first (slice ensures only 10 are kept)
    dispatch(addQuizResult(finalQuizResult));

    // Persist stats to Firestore via listener
    dispatch(updateUserStatsAction());

    // Get latest stats immediately
    // Update leaderboard
    const { stats } = getState().user;
    const bestScore = stats.quizzes.reduce((max, q) => Math.max(max, q.score), 0);
    const leaderboardData = {
        username: user.userData.displayName,
        bestScore,
        quizzesCompleted: stats.totalQuizzesCompleted,
        lastUpdated: Date.now()
    };

    dispatch(saveUserLeaderboardEntryAction({ uid: user.uid, data: leaderboardData }));

    console.log("Finished quiz & stats saved!");
  };
}

/************************************************************
 * Start quiz thunk
 ************************************************************/
export function startQuizThunk({ characters, quizSettings, anime }) {
  return (dispatch) => {
      const { category, mode, type, questionCount: qc } = quizSettings;

      // Filter characters for VoiceActor category
      let filtered = characters;
      if (category === "VoiceActor") {
        filtered = characters.filter(c => c.voice_actors?.some(a => a.language === "Japanese"));
        if (filtered.length === 0) {
          alert("No Japanese voice actor data available for this anime.");
          return;
        }
      }

      // Shuffle characters
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);

      // Determine number of questions
      let questionCount = qc;
      if (type === "Best10" || type === "Best10 Timed") questionCount = 10;
      else if (type === "Best25" || type === "Best25 Timed") questionCount = 25;
      else questionCount = 10; // fallback default

      const selected = shuffled.slice(0, questionCount);

      // Dispatch initialization
      dispatch(initializeQuiz({ characters: selected, category, mode, type, anime }));

      // Load first question
      dispatch(loadCurrentQuestion());

      const q = selected[0];
      if (!q) return;

      // Pick correct answer based on category
      let correctAnswer;
      if (category === "Name") correctAnswer = q.name;
      else if (category === "Role") correctAnswer = q.role;
      else if (category === "VoiceActor") {
        correctAnswer = q.voice_actors?.find(a => a.language === "Japanese")?.name;
      }

      // Generate wrong answers and set question answers
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

    // Check if this is the last question BEFORE advancing
    const isLastQuestion = quiz.questionIndex === quiz.questions.length - 1;

    if (isLastQuestion) {
      // Mark quiz as finished
      dispatch(nextQuestion()); // this sets quizFinished = true

      // Persist stats & leaderboard
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

    const isLastQuestion = quiz.questionIndex === quiz.questions.length - 1;

    if (isLastQuestion) {
      // Mark quiz as finished
      dispatch(nextQuestion()); // this sets quizFinished = true

      // Persist stats & leaderboard
      dispatch(finishQuizThunk());
      return;
    }

    dispatch(advanceQuestion());
  };
}
