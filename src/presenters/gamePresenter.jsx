/***********************************************************************
 * PURPOSE:
 *   - Presenter for the Game/Quiz page
 *   - Reads quiz state from Redux
 *   - Dispatches quiz actions
 *   - Passes props to GameView (pure)
 ***********************************************************************/

import { connect } from "react-redux";
import { GameView } from "../views/gameView";

export function GamePresenter() {

    // TODO:
    //
    // 1. mapStateToProps(state):
    //        questions = state.quiz.questions
    //        index     = state.quiz.index
    //        score     = state.quiz.score
    //        status    = state.quiz.status
    //
    // 2. mapDispatchToProps(dispatch):
    //        onAnswer(option):
    //             dispatch(answerQuestion(option))
    //        onNext():
    //             dispatch(nextQuestion())
    //
    // 3. In mergeProps:
    //        const currentQ = questions[index]
    //
    // 4. Return GameView with props:
    //        <GameView
    //            question={currentQ}
    //            index={index}
    //            score={score}
    //            onAnswer={onAnswer}
    //            onNext={onNext}
    //         />
    //
    // Connect + export
}
