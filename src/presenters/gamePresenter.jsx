/**********************************************************************
 * GAME PRESENTER
 *
 * Responsibilities:
 *  - Connect Redux quiz state → GameView props (mapStateToProps)
 *  - Convert Redux actions → callbacks for the GameView (mapDispatchToProps)
 *  - Perform orchestration logic NOT belonging in the slice:
 *      * Generating wrong answers
 *      * Calling slice actions in correct order
 *      * Triggering next question
 *  - Trigger leaderboard update after a quiz finishes
 *  - Uses final quiz result + user info to update Firestore
 *  - Does NOT handle ranking or sorting (LeaderboardPresenter does that)
 *  - NO JSX, NO UI logic, NO data fetching
 **********************************************************************/
import { connect } from "react-redux";
import { GameView } from "../views/gameView.jsx";  
import {
  initializeQuiz,// <-- to start quiz
  setQuestionAnswers,// <-- to set possible answers
  submitAnswer,//<-- to submit user answer
  nextQuestion,//<-- to move to next question
  loadCurrentQuestion,//<-- to load current question
  timeExpired,//<-- to handle timer expiry
} from "/src/redux/quizSlice.js";

import {
  addQuizResult,// <-- to add completed quiz to user stats
  updateUserStats,// <-- to persist updated stats to Firestore
} from "/src/redux/slices/userSlice.js";

import {
  saveUserLeaderboardEntry,// <-- to update user's leaderboard entry
} from "/src/redux/slices/leaderboardSlice.js";

/********************************************************************************
 * import {
 *   initializeQuiz,
 *  setQuestionAnswers,
 *   submitAnswer,
 *   nextQuestion,
 *   loadCurrentQuestion,
 *   timeExpired,
 *   addQuizResult,
 *   updateUserStats,
 *   saveUserLeaderboardEntry,
 * } from "/src/redux/quizSlice.js";
 *********************************************************************************  */ 
/********************************************************************************
 * Utility: Generate 3 random wrong answers
 **********************************************************************/
function generateWrongAnswers(characters, currentQ, category) {
  const correct = currentQ.correct;
  const pool = characters
    .map(c => (category === "name" ? c.name : c.role))// get names or roles
    .filter(ans => ans && ans !== correct);// exclude correct answer and null/undefined

  return pool.sort(() => 0.5 - Math.random()).slice(0, 3);// shuffle and take first 3
}

/**********************************************************************
 * mapStateToProps — what the View reads
 **********************************************************************/
function mapStateToProps(state) {
  return {
    quizActive: state.quiz.quizActive,// is quiz ongoing
    quizFinished: state.quiz.quizFinished,// is quiz over
    question: state.quiz.currentQuestion,// current question object
    score: state.quiz.score,// current score
    questionIndex: state.quiz.questionIndex,// current question number (0-based)
    total: state.quiz.questions.length,// total questions
    answers: state.quiz.answersShuffled,// possible answers for current question
    category: state.quiz.category,// quiz category
    mode: state.quiz.mode,// quiz mode
    type: state.quiz.type,// quiz type
    timeLimit: state.quiz.timeLimit,// time limit per question
    selectedAnswer: state.quiz.selectedAnswer,// user's selected answer
    isCorrect: state.quiz.isCorrect,// was the selected answer correct
    disableAnswers: !state.quiz.quizActive || state.quiz.isCorrect !== null// disable answer buttons
  };
}

/**********************************************************************
 * mapDispatchToProps — what the View can DO (callbacks)
 * These callbacks contain all QUIZ ORCHESTRATION logic.  
 * **********************************************************************/


/**********************************************************************
 * import { connect } from "react-redux";
 * import { GameView } from "./gameView.jsx";
 *
 * import {
 *   initializeQuiz,
 *  setQuestionAnswers,
 *   submitAnswer,
 *   nextQuestion,
 *   loadCurrentQuestion,
 *   timeExpired,
 * } from "/src/redux/quizSlice.js";
 **********************************************************************/
/*******************************************************************************
 * 1. mapStateToProps
 *    (What the View reads)
 *
 * function mapStateToProps(state) {
 *   return {
 *      quizActive: state.quiz.quizActive,
 *      quizFinished: state.quiz.quizFinished,
 *      question: state.quiz.currentQuestion,
 *      "AND MORE",
 *      timeLimit: state.quiz.timeLimit
 *   };
 *  }
 ********************************************************************************/

// function generateWrongAnswers(characters, correctQuestion, category) { ... }

/**
 * Notes:
 *   For persistence and firestore, the presenter should:
 *   - Read the final quiz state from quizSlice (score, category, type, mode, time, etc.)
 *   - Add the anime info (animeId, animeTitle, animeImg, or what is needed for sidebar and perhaps leaderboard)
 *   - Dispatch addQuizResult from userSlice → adds it locally
 *   - Then call updateUserStats → persists the new stats to Firestore
 *  
 *  When quiz finishes, something like this should be done:
 *   const finalQuizResult = {
 *       score: quizState.score,
 *       total: quizState.questions.length,
 *       category: quizState.category,
 *       mode: quizState.mode,
 *       type: quizState.type,
 *       time: formattedTime,        // or seconds
 *       completedAt: Date.now(),
 *       animeId: selectedAnime.id,
 *       animeTitle: selectedAnime.title,
 *       animeImg: selectedAnime.image_url
 *   };
 *
 * Add locally in Redux
 *  - dispatch(addQuizResult(finalQuizResult));
 *
 * Persist to Firestore
 *  - const uid = getState().user.uid;
 *  - const stats = getState().user.stats;
 *  - dispatch(updateUserStats({ uid, stats }));
 *
 * 
 *  - quizSliceUpdated -> live quiz only
 *  - userSlice -> stores completed quiz + anime info in stats.quizzes
 *  - Firestore -> automatically stores whatever object we pass (i.e saveUserStats already merges it)
 * 
 * Update/Prepare leaderboard entry data (logged-in user only)
 *   const leaderboardData = {
 *       username: state.user.profile.displayName,
 *       bestScore: finalQuizResult.score,         // or highest score so far
 *       quizzesCompleted: stats.quizzes.length,   // total completed
 *       lastUpdated: Date.now()  // Probably not needed for our leaderboard???
 *   };
 * 
 * Dispatch thunk to update Firestore leaderboard
 *  - Only updates the logged-in user's entry
 *  dispatch(saveUserLeaderboardEntry({ uid, leaderboardData }));
 */


/**
 * Leaderboard-related responsibilities that might be needed in gamePresenter
 * 1) After the quiz finishes:
 *    - Read the final quiz result from quizSlice (score, category, type, mode, time, etc.).
 *    - Gather any necessary anime info (id, title, image) to associate with the quiz.
 *    - Update the userSlice:
 *       - dispatch(addQuizResult(finalQuizResult)); // local Redux state
 *       - dispatch(updateUserStats({ uid, stats })); // persist to Firestore
 *    - Update the leaderboard entry:
 *       - Prepare leaderboardData:
 *         const leaderboardData = {
 *              username: getState().user.profile.displayName,
 *              bestScore: finalScore,          // highest score or just this quiz
 *              quizzesCompleted: totalQuizzes, // count from user.stats
 *              lastUpdated: Date.now()      // Probably not needed
 *          };
 *       - Dispatch the thunk to update Firestore:
 *         dispatch(saveUserLeaderboardEntry({ uid, leaderboardData }));
 *       - This should update /leaderboard/{uid} in Firestore.
 * 
 * 2) Important points:
 *    - Presenter orchestrates the calls: gamePresenter should dispatch the leaderboard thunk only after user stats are updated.
 *    - No ranking/sorting is done here — just writing the entry.
 *    - The LeaderboardPresenter reads the Firestore data, sorts, and passes it to LeaderboardView.
 *    - The gamePresenter does not import leaderboard slice for reading global leaderboard entries; it only updates the logged-in user’s entry.
 */
/*******************************************************************************
 * 3. mapDispatchToProps
 *    (What the View can DO → callbacks)
 *    These callbacks contain all QUIZ ORCHESTRATION logic.
 *
 * function mapDispatchToProps(dispatch, ownProps) {
 *
 *   return {
 *
 *       ***********************************************************
 *       * Called once when Game screen starts
 *       * characters come from animeDetails slice (ownProps)
 *       ***********************************************************
 *       startQuizACB({ characters, category, mode, type }) {
 *           // 1. Initialize base quiz state
 *           dispatch(initializeQuiz({ characters, category, mode, type }));
 *          // 2. Load first question object
 *           dispatch(loadCurrentQuestion());
 *          const q = ownProps.store.getState().quiz.currentQuestion;
 *           // Generate Wrong answers
 *           // dispatch(setQuestionAnswers({
 *           //    correct: q.correct,
 *           //    wrong 
 *           }));
 *       },
 *
 *       ***********************************************************
 *        * Called when user clicks an answer button
 *        ***********************************************************
 *       answerACB(answer, characters, category) {
 *           // 1. Mark correct/wrong
 *           dispatch(submitAnswer(answer));
 *           // 2. Move to next question
 *           dispatch(nextQuestion());
 *           const state = ownProps.store.getState().quiz;
 *           // If finished → view handles redirect back
 *           if (state.quizFinished) return;
 *           // 3. Load next question
 *           dispatch(loadCurrentQuestion());
 *           const newQ = ownProps.store.getState().quiz.currentQuestion;
 *           ......
 *       },
 *
 *
 *       ***********************************************************
 *        * Called by timer in GameView
 *        ***********************************************************
 *       timerExpiredACB(characters, category) {
 *           // 1. Mark incorrect
 *           dispatch(timeExpired());
 *           // 2. Move next
 *           dispatch(nextQuestion());
 *           const state = ownProps.store.getState().quiz;
 *           if (state.quizFinished) return;
 *           // 3. Load next question
 *           dispatch(loadCurrentQuestion());
 *       }
 *   };
 * }

/*******************************************************************************
 * 4. Connect presenter → view
 *******************************************************************************/
// export const GamePresenter = connect(mapStateToProps, mapDispatchToProps)(GameView);


