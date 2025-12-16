import { connect } from "react-redux";
import { GameScoreView } from "../views/gameScoreView.jsx";

function mapStateToProps(state) {
  return {
    category: state.quiz.category,
    mode: state.quiz.mode,
    type: state.quiz.type,

    score: state.quiz.score,
    total: state.quiz.questions.length,

    player1: state.quiz.player1,
    player2: state.quiz.player2
  };
}

export const GameScorePresenter = connect(mapStateToProps)(GameScoreView);
