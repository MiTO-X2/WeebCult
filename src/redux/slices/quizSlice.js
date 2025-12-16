import { createSlice } from "@reduxjs/toolkit";

// Fisher–Yates shuffle for answers
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const initialState = {
    quizActive: false,
    category: null,          // "name" | "role" | "voiceActor"
    mode: null,              // "solo" | "1v1"
    type: null,              // "best10" | "timed"
    timeLimit: 10,           // seconds per question (if timed)

    questions: [],           // array of prepared question objects
    questionIndex: 0,
    currentQuestion: null,   // derived when moving to next question

    answersShuffled: [],     // randomized answer order
    selectedAnswer: null,

    score: 0,
    isCorrect: null,         // true | false | null
    quizFinished: false,

    characters: [], // store all characters for generating wrong answers

    player1: 0,
    player2: 0,
    turn: "p1",    // player 1 ALWAYS starts

    // Added for anime info (used in GamePresenter)
    animeId: null,
    animeTitle: null,
    animeImg: null
};

export const quizSlice = createSlice({
    name: "quiz",
    initialState,

    reducers: {
        /************************************************************
         * Called from gamePresenter AFTER characters are loaded
         * Creates the full question list ONCE
         ************************************************************/
        initializeQuiz(state, action) {
            const { characters, category, mode, type, anime } = action.payload;

            state.category = category;
            state.mode = mode;
            state.type = type;

            // Save selected anime info for later (quiz result & leaderboard)
            if (anime) {
                state.animeId = anime.id;
                state.animeTitle = anime.title;
                state.animeImg = anime.image; // field name consistent with API
            }
            

            state.questions = characters.map((c) => ({
                id: c.id,
                image: c.image,
                correct:
                    category === "name" ? c.name :
                    category === "role" ? c.role || "Unknown" :
                    category === "voiceActor" ? c.voice_actors?.find(a => a.language === "Japanese")?.name || "Unknown" :
                    "Unknown",
                category: category
                // Wrong answers are handled in the presenter (easier)
                // Presenter must send: [correct, wrong1, wrong2, wrong3]
            }));

            state.characters = characters;
            state.player1 = 0;
            state.player2 = 0;
            state.turn = "p1";
            state.questionIndex = 0;
            state.score = 0;
            state.quizFinished = false;
            state.quizActive = true;
            state.isCorrect = null;
            state.selectedAnswer = null;
        },

        /************************************************************
         * Presenter passes the 4 answers for the specific question
         ************************************************************/
        setQuestionAnswers(state, action) {
            const { correct, wrong } = action.payload;

            state.answersShuffled = shuffle([correct, ...wrong]);
        },

        /************************************************************
         * Evaluate user answer (pure logic)
         ************************************************************/
        submitAnswer(state, action) {
            const userAnswer = action.payload;
            const correct = state.currentQuestion.correct;

            state.selectedAnswer = userAnswer;
            state.isCorrect = userAnswer === correct;

            if (state.mode === "solo") {
                if (state.isCorrect) state.score += 1;
            }

            if (state.mode === "1v1") {
                if (state.turn === "p1" && state.isCorrect) {
                    state.player1 += 1;
                }
                if (state.turn === "p2" && state.isCorrect) {
                    state.player2 += 1;
                }

                // switch turn always after answering
                state.turn = state.turn === "p1" ? "p2" : "p1";
            }
        },

        /************************************************************
         * Move to next question
         ************************************************************/
        nextQuestion(state) {
            state.selectedAnswer = null;
            state.isCorrect = null;

            if (state.questionIndex >= state.questions.length - 1) {
                state.quizFinished = true;
                state.quizActive = false;
                return;
            }

            state.questionIndex += 1;

            // IMPORTANT: reset answers for next question
            state.answersShuffled = [];
        },

        /************************************************************
         * Presenter calls this once AFTER state.questionIndex changes
         ************************************************************/
        loadCurrentQuestion(state) {
            state.currentQuestion = state.questions[state.questionIndex];
        },

        /************************************************************
         * Timer expired (timed mode)
         ************************************************************/
        timeExpired(state) {
            if (state.type === "timed") {
                state.isCorrect = false;
                state.selectedAnswer = null;

                if (state.mode === "1v1") {
                    // switch turn even if player didn't answer
                    state.turn = state.turn === "p1" ? "p2" : "p1";
                }
            }
        }
    }
});

export const {
    initializeQuiz,
    setQuestionAnswers,
    submitAnswer,
    nextQuestion,
    loadCurrentQuestion,
    timeExpired
} = quizSlice.actions;

export default quizSlice.reducer;
