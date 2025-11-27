/**********************************************************************
 * PURPOSE:
 *   - Manage quiz game state:
 *       current question index
 *       questions[]
 *       score
 *       quiz mode (easy/hard/anime-specific) maybe ?????
 *
 *   - Provide reducers to update answer, next question
 **********************************************************************/

// TODO:
// 1. initialState = {
//       questions: [],
//       index: 0,
//       score: 0,
//       mode: 'easy',
//       status: 'idle'   // playing, finished
//    }
//
// 2. reducers:
//       setQuestions(list)
//       setMode(mode)
//       answerQuestion(isCorrect)
//       nextQuestion()
//       resertQuiz()

// 3. Export reducer & actions
//************************************************************************** */

import { createSlice } from '@reduxjs/toolkit';

// Initial state for the quiz slice
const initialState = {
    questions: [],  //lista av frågor
    currentIndex: 0, //index för nuvarande fråga
    score: 0, //antal rätta svar
    mode: 'easy', // 'easy', 'hard', 'anime-specific'
    status: 'idle' // 'idle', 'playing', 'finished'
};

// Skapa quiz slice
const quizSlice = createSlice({
    name: 'quiz', // Namn på slice
    initialState, // Använd initialState definierad ovan
    reducers: { 

        /**********************************************************
         * setQuestions(list)
         * - Startar ett nytt quiz med en lista av frågor.
         * - Nollställer index, score och status.
         **********************************************************/ 
        setQuestions(state, action) {  // action.payload är listan av frågor    
            state.questions = action.payload;
            state.currentIndex = 0;
            state.score = 0;
            state.status = 'playing';// Sätt status till 'playing' när quizet startar
        },

        // Sätt quiz-läge (easy, hard, anime-specific)  
        setMode(state, action) {
            state.mode = action.payload;
        },

        // Gå till nästa fråga
        nextQuestion(state) {
            if (state.currentIndex < state.questions.length - 1) {  // Kontrollera att vi inte är på sista frågan
                state.currentIndex += 1;// Öka index för nuvarande fråga
            } else {
                state.status = 'finished'; // Avsluta quizet om det var sista frågan
            }  
            
        },

        // Uppdatera poängen baserat på om svaret var rätt eller fel 
        answerQuestion(state, action) {// action.payload är true om svaret var rätt, annars false
            const isCorrect = action.payload;
            if (isCorrect) {// Om svaret var rätt
                state.score += 1;// Öka poängen med 1
            }
            // Om svaret var fel, gör inget med poängen
        
            // Alternativt kan vi automatiskt gå till nästa fråga här
            // state.currentIndex += 1; 
        },

        // Återställ quizet till initialt tillstånd
        resetQuiz(state) {
            state.questions = [];   // Töm frågelistan
            state.currentIndex = 0;// Återställ index till 0
            state.score = 0;// Återställ poängen till 0
            state.status = 'idle';// Återställ status till 'idle'
            state.mode = 'easy'; // Återställ till standardläge
    },
    }
});

// Exportera reducer och actions
export const { setQuestions, setMode, nextQuestion, answerQuestion } = quizSlice.actions;       
export default quizSlice.reducer;








