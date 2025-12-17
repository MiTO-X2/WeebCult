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

export const selectRecentQuizzes = (state) => {
  const allQuizzes = state.user.stats.quizzes || [];
  return [...allQuizzes]
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 3)
    .map(q => ({
      score: q.score ?? 0,
      total: q.total ?? 0,
      category: q.category ?? "Unknown",
      mode: q.mode ?? "Solo",
      type: q.type ?? "Best10",
      completedAt: q.completedAt ?? Date.now(),
      animeImg: q.animeImg ?? null
    }));
};
