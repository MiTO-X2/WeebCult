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
//
// 3. Export reducer & actions
