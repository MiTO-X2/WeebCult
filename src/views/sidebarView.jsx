/***********************************************************************
 * PURE UI COMPONENT
 * Sidebar popup showing:
 *   - Recent quizzes
 *   - Random anime fact
 *
 * Requirements:
 *   - Click outside closes popup
 *   - Slide-in from right
 *   - Close button
 *   - NO logic, NO Redux, NO Firestore calls
 ***********************************************************************/

import { useState } from "react";
import CardFlip from "react-card-flip";
import WeebCultLogo from "../WeebCultLogo.png";

export function SidebarView(props) {
    console.log("SidebarView props:", props);

    const [flippedIndexes, setFlippedIndexes] = useState([]);

    function handleOverlayClickACB(e) {
        if (e.target.classList.contains("sidebar-overlay")) {
            props.onClose();
        }
    }

    function handleFlipACB(index) {
        setFlippedIndexes(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    }

    return (
        <div className="sidebar-overlay" onClick={handleOverlayClickACB}>
            <div className="sidebar-panel">

                {/* CLOSE BUTTON */}
                <button className="sidebar-close-button" onClick={props.onClose}>✕</button>

                <h2 className="sidebar-title">Recent Quiz Score</h2>

                {/* RECENT QUIZZES */}
                <div className="sidebar-list">
                    {props.quizzes.length === 0 && (
                        <p className="sidebar-empty">🎉 No quizzes yet! Start your first quiz and see your scores here. 🚀</p>
                    )}

                    {/* RANDOM NEKO IMAGE */}
                    {props.nekoStatus === "loading" && (
                        <p className="sidebar-neko-loading">Loading neko…</p>
                    )}

                    {props.nekoStatus === "succeeded" && props.nekoData && (
                        <img
                            src={props.nekoData.image_url}
                            alt="Random Neko"
                            className="sidebar-neko-img"
                        />
                    )}


                    {props.quizzes.map(renderQuizItemCB)}
                </div>

                {/* WeebCult Logo */}
                <div className="sidebar-logo">
                    <img
                        src={WeebCultLogo}
                        alt="WeebCult Logo"
                        className="sidebar-logo-img"
                    />
                </div>

            </div>
        </div>
    );

    function renderQuizItemCB(quiz, index) {
        const key = quiz.completedAt || index;

        return (
            <CardFlip
                key={key}
                isFlipped={flippedIndexes.includes(index)}
                flipDirection="horizontal"
            >
                {/* FRONT SIDE */}
                <div className="quiz-item quiz-front" onClick={() => handleFlipACB(index)}>
                    <div className="quiz-front-content">
                        <p>Tap to see your score and details! 🎯</p>
                    </div>
                </div>

                {/* BACK SIDE */}
                <div className="quiz-item quiz-back" onClick={() => handleFlipACB(index)}>
                    <div className="quiz-back-content">
                        {quiz.animeImg && <img className="quiz-thumb" src={quiz.animeImg} alt="" />}
                        <div className="quiz-info">
                            <p><strong>Score:</strong> {quiz.score}/{quiz.total}</p>
                            <p>{quiz.category} | {quiz.mode} | {quiz.type}</p>
                            <p className="quiz-date">{new Date(quiz.completedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </CardFlip>
        );
    }
}
