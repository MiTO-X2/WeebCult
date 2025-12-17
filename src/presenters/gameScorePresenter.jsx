import { connect } from "react-redux";
import { GameScoreView } from "../views/gameScoreView.jsx";
import { startQuizThunk } from "/src/redux/thunks/quizThunks.js";
import { selectQuizAnime } from "../redux/selectors/quizSelectors.js";

function mapStateToProps(state) {
  return {
    category: state.quiz.category,
    mode: state.quiz.mode,
    type: state.quiz.type,
    score: state.quiz.score,
    total: state.quiz.questions.length,
    player1: state.quiz.player1,
    player2: state.quiz.player2,
    characters: state.quiz.characters,
    anime: selectQuizAnime(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPlayAgain: (quizSettings, characters, anime) => {
      dispatch(startQuizThunk({ quizSettings, characters, anime }));
    }
  };
}

function GameScorePresenterComponent(props) {
  const handlePlayAgainACB = () => {
    const quizSettings = { category: props.category, mode: props.mode, type: props.type };
    props.onPlayAgain(quizSettings, props.characters, props.anime);
  };

  return <GameScoreView {...props} onPlayAgain={handlePlayAgainACB} />;
}

export const GameScorePresenter = 
    connect(mapStateToProps, mapDispatchToProps)(GameScorePresenterComponent);
