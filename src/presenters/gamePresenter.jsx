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
import { GameScorePresenter } from "./gameScorePresenter.jsx"; 
import { selectCurrentQuestionWithAnswers } from "/src/redux/selectors/quizSelectors.js"; 
import { startQuizThunk, answerThunk, timerExpiredThunk } from "/src/redux/thunks/quizThunks.js"; 

/**********************************************************************
 * mapStateToProps — what the View reads
 **********************************************************************/
function mapStateToProps(state) {
  return {
    quizActive: state.quiz.quizActive,
    quizFinished: state.quiz.quizFinished,
    question: selectCurrentQuestionWithAnswers(state),
    score: state.quiz.score,

    // SOLO + MULTiplayer
    player1: state.quiz.player1,
    player2: state.quiz.player2,
    turn: state.quiz.turn,

    index: state.quiz.questionIndex,
    total: state.quiz.questions.length,
    category: state.quiz.category,
    mode: state.quiz.mode,
    type: state.quiz.type,
    timeLimit: state.quiz.timeLimit,
    selectedAnswer: state.quiz.selectedAnswer,
    isCorrect: state.quiz.isCorrect,
    disableAnswers: !state.quiz.quizActive || state.quiz.isCorrect !== null,
    animeId: state.quiz.animeId,
    animeTitle: state.quiz.animeTitle,
    animeImg: state.quiz.animeImg
  };
}

/**********************************************************************
 * mapDispatchToProps — what the View can DO (callbacks)
 * These callbacks contain all QUIZ ORCHESTRATION logic.  
 * **********************************************************************/
function mapDispatchToProps(dispatch) {
  return {
    startQuiz: (payload) => dispatch(startQuizThunk(payload)),
    onAnswer: (answer) => dispatch(answerThunk(answer)),
    onTimeUp: () => dispatch(timerExpiredThunk())
  };
}

function GamePresenterComponent(props) {
  if (props.quizFinished) {
    return <GameScorePresenter />;
  }

  return <GameView {...props} />;
}

// Export the connected GamePresenter -> View
export const GamePresenter = 
    connect(mapStateToProps, mapDispatchToProps)(GamePresenterComponent);
