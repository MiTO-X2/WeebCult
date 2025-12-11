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
 * Utility: Generate 3 random wrong answers
 **********************************************************************/
function generateWrongAnswers(characters, correctQuestion, category) {
  const wrongAnswers = new Set();

  while (wrongAnswers.size < 3) {// until we have 3 unique wrong answers
    const randIndex = Math.floor(Math.random() * characters.length);// random index
    const candidate = characters[randIndex];// get character
    if (!candidate) continue;// safety check

    // Get the answer based on category

    const candidateAnswer =// extract answer
      category === "name" ? candidate.name: candidate.role || "Unknown";// default to "Unknown" if role missing

    // Avoid duplicates and the correct answer itself
    // Add to set if unique, and not the correct answer, and not already in the set
    if (candidateAnswer && candidateAnswer !== correctQuestion.correct && !wrongAnswers.has(candidateAnswer)) 
      {
         wrongAnswers.add(candidateAnswer);// add to set
      }
  }

  return Array.from(wrongAnswers);// convert Set to Array
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
    disableAnswers: !state.quiz.quizActive || state.quiz.isCorrect !== null,// disable answer buttons

    // Anime info (added in quizSlice)
    animeId: state.quiz.animeId,
    animeTitle: state.quiz.animeTitle,
    animeImg: state.quiz.animeImg,

  };
}

/**********************************************************************
 * mapDispatchToProps — what the View can DO (callbacks)
 * These callbacks contain all QUIZ ORCHESTRATION logic.  
 * **********************************************************************/
function mapDispatchToProps(dispatch, ownProps) {

  return {  
      /*************************************************************
       * Called once when Game screen starts
       * characters come from animeDetails slice (ownProps) 
       * *************************************************************/
      startQuizACB({ characters, category, mode, type, anime }) {
       
        // 1. Initialize base quiz state
        dispatch(initializeQuiz({ characters, category, mode, type, anime }));
       
        // 2. Load first question object
        dispatch(loadCurrentQuestion());
        const q = ownProps.store.getState().quiz.currentQuestion;
       
        // Generate Wrong answers
        dispatch(setQuestionAnswers({
          correct: q.correct,
          wrong: generateWrongAnswers(characters, q, category)
        }));
      },

      /*************************************************************
       * Called when user clicks an answer button
       * *************************************************************/
      answerACB(answer, characters, category) {
        // 1. Mark correct/wrong
        dispatch(submitAnswer(answer));
        const state = ownProps.store.getState().quiz;
        
        if(quizState.quizFinished){
          // Quiz finished → handle result in view (redirect back)
          dispatch(quizfinishedACB( ownProps.store.getState() ));
          return;
        }
        
        // 2. Move to next question
        dispatch(nextQuestion());
        
        // 3. Load next question
        dispatch(loadCurrentQuestion());
        const newQ = ownProps.store.getState().quiz.currentQuestion;
        
        // Generate Wrong answers
        dispatch(setQuestionAnswers({
          correct: newQ.correct,
          wrong: generateWrongAnswers(characters, newQ, category)
        }));  
      },

      /*************************************************************
       * Called by timer in GameView
       * *************************************************************/ 
      timerExpiredACB(characters, category) {
        
        // 1. Mark incorrect
        dispatch(timeExpired());
        const state = ownProps.store.getState().quiz;
        
        if(state.quizFinished){
          // Quiz finished → handle in view (redirect back)
          dispatch(quizfinishedACB( ownProps.store.getState() ));
          return;
        } 
       
        // 2. Move next
        dispatch(nextQuestion());
       
        // 3. Load next question
        dispatch(loadCurrentQuestion());
        const newQ = ownProps.store.getState().quiz.currentQuestion;
       
        // Generate Wrong answers
        dispatch(setQuestionAnswers({
          correct: newQ.correct,
          wrong: generateWrongAnswers(characters, newQ, category)
        }));  
      },



      /*************************************************************/
      onExit() {
        // Any cleanup if needed when exiting game view
        window.location.href = "#/";// simple redirect to home
        }
    };
  }
  
  

  /*************************************************************
   * Called when quiz is finished to update user stats and leaderboard
   * Finalize quiz and update Firestore
 **********************************************************************/
function gamePresenterFinishQuizACB(fullState) {
  return async function (dispatch) {
    const quizState = fullState.quiz;
    const userState = fullState.user;

    const finalQuizResult = {
      score: quizState.score,
      total: quizState.questions.length,
      category: quizState.category,
      mode: quizState.mode,
      type: quizState.type,
      time: quizState.timeLimit,
      completedAt: Date.now(),
      animeId: quizState.animeId,
      animeTitle: quizState.animeTitle,
      animeImg: quizState.animeImg,
    };

    //1. Add to local Redux user stats
    dispatch(addQuizResult(finalQuizResult));

    //2. Persist to Firestore (user stats)
    const uid = userState.uid;
    const stats = userState.stats;
    dispatch(updateUserStats({ uid, stats }));

    //3. Update leaderboard entry
    const leaderboardData = {
      username: userState.profile?.displayName || "Anonymous",
      bestScore: finalQuizResult.score,
      quizzesCompleted: stats.quizzes.length,
      lastUpdated: Date.now(),
    };
    dispatch(saveUserLeaderboardEntry({ uid, leaderboardData }));
  };

  
}

// Export the connected GamePresenter -> View
export const GamePresenter = connect(mapStateToProps, mapDispatchToProps)(GameView);



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


