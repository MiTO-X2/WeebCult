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
    category: null,          // "name" | "age"
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
    quizFinished: false
};

export const quizSliceUpdated = createSlice({
    name: "quizUpdated",
    initialState,

    reducers: {
        /************************************************************
         * Called from gamePresenter AFTER characters are loaded
         * Creates the full question list ONCE
         ************************************************************/
        initializeQuiz(state, action) {
            const { characters, category, mode, type } = action.payload;

            state.category = category;
            state.mode = mode;
            state.type = type;

            state.questions = characters.map((c) => ({
                id: c.id,
                image: c.image,
                correct: category === "name" ? c.name : c.role,
                // Wrong answers are handled in the presenter (easier)
                // Presenter must send: [correct, wrong1, wrong2, wrong3]
            }));

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

            if (state.isCorrect) {
                state.score += 1;
            }
        },

        /************************************************************
         * Move to next question
         ************************************************************/
        nextQuestion(state) {
            state.selectedAnswer = null;
            state.isCorrect = null;

            state.questionIndex += 1;

            if (state.questionIndex >= state.questions.length) {
                state.quizFinished = true;
                state.quizActive = false;
                return;
            }
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
} = quizSliceUpdated.actions;

export default quizSliceUpdated.reducer;
