/***********************************************************************
 * PURE UI VIEW (NO LOGIC)
 * 
 * Receives via props:
 *   - question: {
 *       image, prompt, answers: [{ text, flashClass }]
 *     }
 *   - index: current question index (0-based)
 *   - score / player1 / player2: UI-only numbers
 *   - turn: "p1" | "p2"
 *   - mode: "solo" | "versus"
 *   - titleColor: CSS color string ("purple" | "orange" | "yellow")
 *   - titleFlash: "" | "flash-green" | "flash-red"
 *   - onAnswer: callback(answerText)
 *   - onExit: callback() → go back to main page
 ***********************************************************************/

import "../style.css";

// 3rd party component (Component made by others)
import { CountdownCircleTimer } from "react-countdown-circle-timer"; 

export function GameView(props) {
    const q = props.question;

    return (
        <div className="game-view">

            {/* TOP BAR */}
            <div className="top-bar">
                <div className="logo-title" onClick={props.onExit}>
                    <img 
                        src="/WeebCultLogo.png"       
                        alt="WeebCult Logo"
                        className="logo" />
                    <span 
                        className={`title ${props.titleFlash}`}
                        style={{ color: props.titleColor }}
                    >
                        WeebCult
                    </span>
                </div>

                {/* SCORE AREA */}
                <div className="score-area">

                    {props.mode === "solo" && (
                        <div className="solo-score active">
                            <span>Score:</span> {props.score}
                        </div>
                    )}

                    {props.mode === "versus" && (
                        <div className="versus-score">
                            
                            <div className={`player-box ${props.turn === "p1" ? "active" : "inactive"}`}>
                                <div>Player 1</div>
                                <div>{props.player1}</div>
                            </div>

                            <div className={`player-box ${props.turn === "p2" ? "active" : "inactive"}`}>
                                <div>Player 2</div>
                                <div>{props.player2}</div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* LEFT INFO: Question # + Timer */}
            <div className="left-info">
                <div className="question-number">Question {props.index + 1}</div>

                {props.type === "timed" && (
                    <div className="timer-wrapper">
                        <CountdownCircleTimer
                            key={props.index}               
                            isPlaying
                            duration={props.timeLimit}      
                            colors={["#7b2cbf"]}
                            size={170}
                            onComplete={() => {
                                props.onTimeUp();
                                return { shouldRepeat: false };
                            }}
                        >
                            {({ remainingTime }) => (
                                <div className="timer-text">{remainingTime}</div>
                            )}
                        </CountdownCircleTimer>
                    </div>
                )}
            </div>

            {/* CENTER INFO: Image + Prompt */}
            <div className="center-info">
                <img 
                    src={q.image || "/characters/default.png"}
                    className="question-img"
                    alt="anime character"
                />
                <h3 className="question-prompt">{q.prompt}</h3>
            </div>

            {/* ANSWER BUTTONS */}
            <div className="answers-grid">
                {q.answers.map((a, i) => (
                    <button
                        key={i}
                        className={`answer-btn ${a.flashClass || ""}`}
                        onClick={() => props.onAnswer(a.text)}
                        disabled={props.disableAnswers}
                    >
                        {a.text}
                    </button>
                ))}
            </div>
        </div>
    );
}
