import { createListenerMiddleware } from '@reduxjs/toolkit';
import { initializeQuiz, nextQuestion, submitAnswer, setQuestionAnswers } from '../slices/quizSlice.js';

export const quizListener = createListenerMiddleware();

// List of actions that should trigger saving to localStorage
const actionsToPersist = [
  initializeQuiz.type,
  nextQuestion.type,
  submitAnswer.type,
  setQuestionAnswers.type
];

quizListener.startListening({
  predicate: (action) => actionsToPersist.includes(action.type),
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    try {
      const serialized = JSON.stringify(state.quiz);
      localStorage.setItem('quizState', serialized);
    } catch (e) {
      console.error("Failed to save quiz state to localStorage", e);
    }
  }
});
