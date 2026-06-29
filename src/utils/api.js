/**
 * Fetch pedagogical feedback from Gemini AI with retry logic
 * @param {Object} quiz - Quiz state object
 * @param {string} chosen - User's chosen answer
 * @param {boolean} isCorrect - Whether answer was correct
 * @param {number} attempt - Current attempt number (default: 0)
 * @returns {Promise<string>} AI feedback message
 */
export async function fetchTutorFeedback(quiz, chosen, isCorrect, attempt = 0) {
  const prompt = `Você é um tutor inteligente de um sistema educacional sobre os 48 países da Copa do Mundo 2026.
Um aluno respondeu a uma pergunta sobre ${quiz.country.name} no eixo ${quiz.axis}.

Pergunta: "${quiz.question}"
Resposta do aluno: "${chosen}"
Resposta correta: "${quiz.correct}"
O aluno ${isCorrect ? "ACERTOU" : "ERROU"}.

Dê um feedback pedagógico em 2-3 frases, em português, ${
    isCorrect
      ? "parabenizando e acrescentando uma curiosidade sobre o tema"
      : "explicando o erro com uma dica contextual sobre " + quiz.country.name
  }. Seja encorajador, direto e educativo. Não use asteriscos nem markdown e quando encaixar, use de um exemplo resolvido.`;

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        import.meta.env.VITE_GEMINI_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    if (res.status === 429 && attempt < 2) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      return fetchTutorFeedback(quiz, chosen, isCorrect, attempt + 1);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return (
      text ||
      "Continue estudando! Cada pergunta te aproxima do domínio completo."
    );
  } catch {
    return "Continue estudando! Cada pergunta te aproxima do domínio completo.";
  }
}
