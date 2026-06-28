import { COUNTRIES } from "../countries.js";

export const QUIZ_OPTIONS_COUNT = 4;

export const INITIAL_PROFICIENCY = () => {
  const p = {};
  COUNTRIES.forEach((c) => {
    p[c.name] = 0;
  });
  return p;
};
