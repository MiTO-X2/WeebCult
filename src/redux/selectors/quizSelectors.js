export const selectCurrentQuestionPrompt = (state) => {
  const q = state.quiz.currentQuestion;
  if (!q) return "";
  switch (q.category) {
    case "Role": return "What is the role of this character?";
    case "Name": return "Who is this character?";
    case "VoiceActor": return "Who is the Japanese voice actor for this character?";
    default: return "Who is this character?";
  }
};

export const selectCurrentQuestionWithAnswers = (state) => {
  const q = state.quiz.currentQuestion;
  if (!q) return { image: "", prompt: "", answers: [] };
  return {
    image: q.image || "/characters/default.png",
    prompt: selectCurrentQuestionPrompt(state),
    answers: state.quiz.answersShuffled.map((a) => ({ text: a })),
  };
};

export const selectQuizAnime = (state) => ({
  id: state.quiz.animeId,
  title: state.quiz.animeTitle,
  image: state.quiz.animeImg
});