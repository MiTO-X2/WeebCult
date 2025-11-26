/***********************************************************************
 * Pure UI.
 * Shows:
 *   - The anime image/question
 *   - 4 answer buttons
 *   - Score + progress
 ***********************************************************************/

export function GameView(props) {

    // TODO:
    // - Show question prompt + image
    // - Map answer options → <button>
    // - NO logic (correct/wrong is handled in presenter)

    const q = props.question;

    return (
        <div className="game-view">

            <h2>Question {props.index + 1}</h2>

            <img src={q.image} className="question-img" />

            <h3>{q.prompt}</h3>

            <div className="answers">
                {q.answers.map((a, i) => (
                    <button key={i} onClick={() => props.onAnswer(a)}>
                        {a}
                    </button>
                ))}
            </div>

            <button onClick={props.onNext}>Next</button>
            <button onClick={props.onRestart}>Restart</button>

            <div className="score">Score: {props.score}</div>
        </div>
    );
}