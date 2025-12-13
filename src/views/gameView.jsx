/***********************************************************************
 * PURE UI VIEW (NO LOGIC)
 *
 * Props:
 *   - question: { image, prompt, answers: [{ text }] }
 *   - index: current question index (0-based)
 *   - score / player1 / player2: UI-only numbers
 *   - turn: "p1" | "p2"
 *   - mode: "solo" | "versus"
 *   - type: "best10" | "timed"
 *   - timeLimit: seconds per question
 *   - selectedAnswer: last clicked answer text
 *   - isCorrect: true | false | null
 *   - disableAnswers: boolean
 *   - onAnswer: callback(answerText)
 *   - onTimeUp: callback()
 *   - onExit: callback() → go back to main page
 ***********************************************************************/

import "../style.css";
// 3rd-party countdown timer React component (component made by others)
import { CountdownCircleTimer } from "react-countdown-circle-timer"; 
import WeebCultLogo from "../WeebCultLogo.png";

export function GameView(props) {
  const q = props.question;

  // Determine which answer is correct/wrong for flash animation
  const getAnswerClass = (a) => {
    if (!props.selectedAnswer) return "";
    if (a.text === props.selectedAnswer) {
      return props.isCorrect ? "flash-green" : "flash-red";
    }
    return "";
  };

  return (
    <div className="game-view">

      {/* TOP BAR */}
      <div className="top-bar">
        <div className="logo-title" onClick={props.onExit}>
          <img 
            src={WeebCultLogo}       
            alt="WeebCult Logo"
            className="logo" 
          />
          <span className="title">WeebCult</span>
        </div>

        {/* SCORE AREA */}
        <div className="score-area">
          {props.mode === "solo" && (
            <div className="solo-score active">
              <span>Score:</span> {props.score}
            </div>
          )}

          {props.mode === "1v1" && (
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
          <div className= "timer-wrapper">
            <CountdownCircleTimer
              key={props.index}               
              isPlaying
              duration={props.timeLimit}      
              colors={["#7b2cbf"]} // base color
              size={170}
              onComplete={() => {
                props.onTimeUp();
                return { shouldRepeat: false };
              }}
            >
              {({ remainingTime }) => (
                <div className={`timer-text ${remainingTime <= 3 ? "flash-red" : ""}`}>
                  {remainingTime}
                </div>
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
            className={`answer-btn ${getAnswerClass(a)}`}
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
