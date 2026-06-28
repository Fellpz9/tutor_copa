import { useState } from "react";
import { fetchTutorFeedback } from "../utils/api.js";

export function useTutorFeedback() {
  const [tutorMsg, setTutorMsg] = useState("");
  const [loadingTutor, setLoadingTutor] = useState(false);

  const fetchFeedback = async (quiz, chosen, isCorrect) => {
    setLoadingTutor(true);
    const feedback = await fetchTutorFeedback(quiz, chosen, isCorrect);
    setTutorMsg(feedback);
    setLoadingTutor(false);
  };

  const reset = () => {
    setTutorMsg("");
    setLoadingTutor(false);
  };

  return {
    tutorMsg,
    loadingTutor,
    fetchFeedback,
    reset,
  };
}
