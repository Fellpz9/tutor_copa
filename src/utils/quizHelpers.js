import { QUIZ_OPTIONS_COUNT } from "./constants.js";

export function generateOptions(correct, allCountries, field) {
  const pool = allCountries
    .map((c) => field(c))
    .filter((v) => v !== correct);
  const shuffled = pool
    .sort(() => Math.random() - 0.5)
    .slice(0, QUIZ_OPTIONS_COUNT - 1);
  const options = [...shuffled, correct].sort(() => Math.random() - 0.5);
  return options;
}

// Mapping de eixos para funções de extração de campo
export const fieldMappingConfig = {
  História: (country, questionText) => {
    if (questionText.includes("ano")) return String(country.independence);
    if (questionText.includes("títulos")) return String(country.worldCups);
    return country.historicalFacts.split(",")[0].trim();
  },

  Geografia: (country, questionText) => {
    if (questionText.includes("continente")) return country.continent;
    if (questionText.includes("capital")) return country.capital;
    return country.climate.split(" e ")[0].trim();
  },

  Cultura: (country, questionText) => {
    if (questionText.includes("idioma"))
      return country.language.split(" e ")[0].trim();
    if (questionText.includes("prato"))
      return country.gastronomy.split(",")[0].trim();
    return country.traditions.split(",")[0].trim();
  },
};

export function getFieldFn(axis) {
  return fieldMappingConfig[axis] || fieldMappingConfig.Cultura;
}
