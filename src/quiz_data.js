export const AXES = ["História", "Geografia", "Cultura"];

export const QUESTIONS = {
  História: [
    {
      q: (c) => `Em que ano ${c.name} declarou sua independência?`,
      a: (c) => String(c.independence),
      hint: (c) => `Pense nos grandes eventos históricos de ${c.name}.`,
    },
    {
      q: (c) => `Quantos títulos mundiais de futebol ${c.name} conquistou?`,
      a: (c) => String(c.worldCups),
      hint: (c) =>
        `${c.name} disputou várias Copas do Mundo ao longo da história.`,
    },
    {
      q: (c) => `Qual é um marco histórico importante de ${c.name}?`,
      a: (c) => c.historicalFacts.split(",")[0].trim(),
      hint: (c) =>
        `Pense na história de fundação ou independência de ${c.name}.`,
    },
  ],
  Geografia: [
    {
      q: (c) => `Em qual continente ${c.name} está localizado?`,
      a: (c) => c.continent,
      hint: (c) => `Pense na posição geográfica de ${c.name} no mapa-múndi.`,
    },
    {
      q: (c) => `Qual é a capital de ${c.name}?`,
      a: (c) => c.capital,
      hint: (c) => `É a cidade sede do governo de ${c.name}.`,
    },
    {
      q: (c) => `Como é o clima predominante em ${c.name}?`,
      a: (c) => c.climate.split(" e ")[0].trim(),
      hint: (c) => `Pense na localização geográfica e latitude de ${c.name}.`,
    },
  ],
  Cultura: [
    {
      q: (c) => `Qual é o idioma oficial de ${c.name}?`,
      a: (c) => c.language.split(" e ")[0].trim(),
      hint: (c) => `Considere a história colonial e cultural de ${c.name}.`,
    },
    {
      q: (c) => `Qual é um prato típico da culinária de ${c.name}?`,
      a: (c) => c.gastronomy.split(",")[0].trim(),
      hint: (c) =>
        `${c.name} é famosa por sua gastronomia rica e diversificada.`,
    },
    {
      q: (c) => `Qual é uma tradição cultural famosa de ${c.name}?`,
      a: (c) => c.traditions.split(",")[0].trim(),
      hint: (c) => `Pense nas celebrações e festas populares de ${c.name}.`,
    },
  ],
};
