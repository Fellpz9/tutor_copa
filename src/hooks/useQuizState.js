import { useState } from "react";
import { COUNTRIES } from "../countries.js";
import { AXES, QUESTIONS } from "../quiz_data.js";
import { generateOptions, getFieldFn } from "../utils/quizHelpers.js";

export function useQuizState() {
  const [quizState, setQuizState] = useState(null);
  const [readCountries, setReadCountries] = useState({});

  const startQuiz = (country, axis) => {
    const axisQuestions = QUESTIONS[axis];
    const q = axisQuestions[Math.floor(Math.random() * axisQuestions.length)];
    const correct = q.a(country);

    const fieldFn = getFieldFn(axis);
    const options = generateOptions(
      correct,
      COUNTRIES,
      (c) => fieldFn(c, q.q(c))
    );

    setQuizState({
      country,
      axis,
      question: q.q(country),
      correct,
      options,
      hint: q.hint(country),
    });
  };

  const recordRead = (countryName) => {
    const reads = readCountries[countryName] || 0;
    if (reads < 3) {
      setReadCountries((prev) => ({ ...prev, [countryName]: reads + 1 }));
      return true;
    }
    return false;
  };

  const getReadCount = (countryName) => readCountries[countryName] || 0;

  return {
    quizState,
    setQuizState,
    startQuiz,
    recordRead,
    getReadCount,
  };
}
