/***********************************************************************
 * Pure UI.
 * Shows:
 *   - The anime image/question
 *   - 4 answer buttons
 *   - Score + progress
 ***********************************************************************/

export function GameView({ question, index, score, onAnswer, onNext, onRestart }) {

    // TODO:
    // - Show the question image
    // - List answer options as <button>
    // - Show progress (index + 1 / total)
    // - No business logic here

    return (
        <div className="game-view">

            <h2>Question {index + 1}</h2>

            <img src={question.image} className="question-img" />

            <h3>{question.prompt}</h3>

            <div className="answers">
                {question.answers.map((a, i) => (
                    <button key={i} onClick={() => onAnswer(a)}>
                        {a}
                    </button>
                ))}
            </div>

            <button onClick={onNext}>Next</button>
            <button onClick={onRestart}>Restart</button>

            <div className="score">Score: {score}</div>

        </div>
    );
}
