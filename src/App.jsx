import { useState, useEffect, useCallback } from "react";

import { COUNTRIES } from "./countries.js";

import { AXES, QUESTIONS } from "./quiz_data.js";

const QUIZ_OPTIONS_COUNT = 4;

function generateOptions(correct, allCountries, field) {
  const pool = allCountries.map((c) => field(c)).filter((v) => v !== correct);
  const shuffled = pool
    .sort(() => Math.random() - 0.5)
    .slice(0, QUIZ_OPTIONS_COUNT - 1);
  const options = [...shuffled, correct].sort(() => Math.random() - 0.5);
  return options;
}

const INITIAL_PROFICIENCY = () => {
  const p = {};
  COUNTRIES.forEach((c) => {
    p[c.name] = 0;
  });
  return p;
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [proficiency, setProficiency] = useState(INITIAL_PROFICIENCY);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAxis, setSelectedAxis] = useState(null);
  const [readCountries, setReadCountries] = useState({});
  const [quizState, setQuizState] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [badges, setBadges] = useState([]);
  const [tutorMsg, setTutorMsg] = useState("");
  const [loadingTutor, setLoadingTutor] = useState(false);
  const [filterContinent, setFilterContinent] = useState("Todos");

  const continents = [
    "Todos",
    ...Array.from(new Set(COUNTRIES.map((c) => c.continent))),
  ].sort();

  const filteredCountries =
    filterContinent === "Todos"
      ? COUNTRIES
      : COUNTRIES.filter((c) => c.continent === filterContinent);

  const addProficiency = useCallback((country, delta) => {
    setProficiency((prev) => {
      const current = prev[country] || 0;
      const newVal = Math.min(100, current + delta);
      const wasComplete = current >= 100;
      if (newVal >= 100 && !wasComplete) {
        setBadges((b) => (b.includes(country) ? b : [...b, country]));
      }
      return { ...prev, [country]: newVal };
    });
  }, []);

  const handleReadCountry = (country) => {
    const reads = readCountries[country.name] || 0;
    if (reads < 3) {
      addProficiency(country.name, 10);
      setReadCountries((prev) => ({ ...prev, [country.name]: reads + 1 }));
    }
    setSelectedCountry(country);
    setSelectedAxis(null);
    setScreen("read");
  };

  const handleStartQuiz = (country, axis) => {
    const axisQuestions = QUESTIONS[axis];
    const q = axisQuestions[Math.floor(Math.random() * axisQuestions.length)];
    const correct = q.a(country);
    const fieldFn =
      axis === "História"
        ? (c) =>
            q.q(c).includes("ano")
              ? String(c.independence)
              : q.q(c).includes("títulos")
                ? String(c.worldCups)
                : c.historicalFacts.split(",")[0].trim()
        : axis === "Geografia"
          ? (c) =>
              q.q(c).includes("continente")
                ? c.continent
                : q.q(c).includes("capital")
                  ? c.capital
                  : c.climate.split(" e ")[0].trim()
          : (c) =>
              q.q(c).includes("idioma")
                ? c.language.split(" e ")[0].trim()
                : q.q(c).includes("prato")
                  ? c.gastronomy.split(",")[0].trim()
                  : c.traditions.split(",")[0].trim();

    const options = generateOptions(correct, COUNTRIES, fieldFn);
    setQuizState({
      country,
      axis,
      question: q.q(country),
      correct,
      options,
      hint: q.hint(country),
    });
    setFeedback(null);
    setTutorMsg("");
    setScreen("quiz");
  };

  const handleAnswer = async (option) => {
    const isCorrect = option === quizState.correct;
    if (isCorrect) {
      addProficiency(quizState.country.name, 35);
      setFeedback({
        correct: true,
        msg: `Correto! A resposta é: ${quizState.correct}`,
      });
    } else {
      setFeedback({
        correct: false,
        msg: `Incorreto. A resposta correta é: ${quizState.correct}`,
      });
    }
    await fetchTutorFeedback(quizState, option, isCorrect);
  };

  const fetchTutorFeedback = async (quiz, chosen, isCorrect, attempt = 0) => {
    setLoadingTutor(true);
    const prompt = `Você é um tutor inteligente de um sistema educacional sobre os 48 países da Copa do Mundo 2026.
Um aluno respondeu a uma pergunta sobre ${quiz.country.name} no eixo ${quiz.axis}.

Pergunta: "${quiz.question}"
Resposta do aluno: "${chosen}"
Resposta correta: "${quiz.correct}"
O aluno ${isCorrect ? "ACERTOU" : "ERROU"}.

Dê um feedback pedagógico em 2-3 frases, em português, ${isCorrect ? "parabenizando e acrescentando uma curiosidade sobre o tema" : "explicando o erro com uma dica contextual sobre " + quiz.country.name}. Seja encorajador, direto e educativo. Não use asteriscos nem markdown.`;

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +import.meta.env.VITE_GEMINI_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (res.status === 429 && attempt < 2) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        return fetchTutorFeedback(quiz, chosen, isCorrect, attempt + 1);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setTutorMsg(text || "Continue estudando! Cada pergunta te aproxima do domínio completo.");
    } catch {
      setTutorMsg(
        "Continue estudando! Cada pergunta te aproxima do domínio completo."
      );
    }
    setLoadingTutor(false);
  };

  const totalCompleted = Object.values(proficiency).filter(
    (v) => v >= 100,
  ).length;
  const avgProficiency = Math.round(
    Object.values(proficiency).reduce((a, b) => a + b, 0) / COUNTRIES.length,
  );

  if (screen === "home") {
    return (
      <div
        style={{
          padding: "1.5rem 1rem",
          fontFamily: "var(--font-sans)",
          color: "var(--color-text-primary)",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px" }}>
          Copa do Mundo 2026
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-text-secondary)",
            margin: "0 0 1.5rem",
          }}
        >
          Sistema de Tutor Inteligente
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginBottom: "1.5rem",
          }}
        >
          {[
            { label: "Países disponíveis", value: COUNTRIES.length },
            { label: "Países concluídos", value: totalCompleted },
            { label: "Proficiência média", value: `${avgProficiency}%` },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                background: "var(--color-background-secondary)",
                borderRadius: "var(--border-radius-md)",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px" }}>
                {m.value}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--color-text-secondary)",
                  margin: 0,
                }}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {badges.length > 0 && (
          <div
            style={{
              marginBottom: "1.5rem",
              background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-lg)",
              padding: "1rem",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 8px" }}>
              Insígnias conquistadas
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {badges.map((b) => (
                <span
                  key={b}
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    background: "#EAF3DE",
                    color: "#27500A",
                    borderRadius: "var(--border-radius-md)",
                  }}
                >
                  <i
                    className="ti ti-trophy"
                    aria-hidden="true"
                    style={{ marginRight: 4 }}
                  ></i>
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: "1rem",
          }}
        >
          <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            Filtrar por continente:
          </label>
          <select
            value={filterContinent}
            onChange={(e) => setFilterContinent(e.target.value)}
            style={{ fontSize: 13 }}
          >
            {continents.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 10,
          }}
        >
          {filteredCountries.map((country) => {
            const p = proficiency[country.name] || 0;
            const done = p >= 100;
            return (
              <div
                key={country.name}
                onClick={() => handleReadCountry(country)}
                style={{
                  background: "var(--color-background-primary)",
                  border: done
                    ? "1.5px solid #1D9E75"
                    : "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-lg)",
                  padding: "12px",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    {country.name}
                  </span>
                  {done && (
                    <i
                      className="ti ti-rosette"
                      aria-hidden="true"
                      style={{ color: "#1D9E75", fontSize: 16 }}
                    ></i>
                  )}
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-secondary)",
                    margin: "0 0 8px",
                  }}
                >
                  {country.continent}
                </p>
                <div
                  style={{
                    height: 4,
                    background: "var(--color-border-tertiary)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${p}%`,
                      background: done ? "#1D9E75" : "#378ADD",
                      borderRadius: 2,
                      transition: "width 0.3s",
                    }}
                  ></div>
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-secondary)",
                    margin: "4px 0 0",
                    textAlign: "right",
                  }}
                >
                  {p}%
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (screen === "read") {
    const c = selectedCountry;
    const p = proficiency[c.name] || 0;
    const reads = readCountries[c.name] || 0;
    return (
      <div
        style={{
          padding: "1.5rem 1rem",
          fontFamily: "var(--font-sans)",
          color: "var(--color-text-primary)",
        }}
      >
        <button
          onClick={() => setScreen("home")}
          style={{ marginBottom: "1rem", fontSize: 13 }}
        >
          <i
            className="ti ti-arrow-left"
            aria-hidden="true"
            style={{ marginRight: 4 }}
          ></i>
          Voltar
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>{c.name}</h2>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            {p}% concluído
          </span>
        </div>
        <div
          style={{
            height: 6,
            background: "var(--color-border-tertiary)",
            borderRadius: 3,
            overflow: "hidden",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${p}%`,
              background: p >= 100 ? "#1D9E75" : "#378ADD",
              borderRadius: 3,
              transition: "width 0.4s",
            }}
          ></div>
        </div>

        {reads < 3 && (
          <div
            style={{
              fontSize: 12,
              color: "#185FA5",
              background: "#E6F1FB",
              borderRadius: "var(--border-radius-md)",
              padding: "8px 12px",
              marginBottom: "1rem",
            }}
          >
            <i
              className="ti ti-info-circle"
              aria-hidden="true"
              style={{ marginRight: 4 }}
            ></i>
            Leitura contabiliza +10% de proficiência (máx. 30% por leitura).
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: "1.5rem",
          }}
        >
          {[].map((row) => (
            <div
              key={row.label}
              style={{
                background: "var(--color-background-secondary)",
                borderRadius: "var(--border-radius-md)",
                padding: "10px 12px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "var(--color-text-secondary)",
                  margin: "0 0 2px",
                }}
              >
                <i
                  className={`ti ${row.icon}`}
                  aria-hidden="true"
                  style={{ marginRight: 4 }}
                ></i>
                {row.label}
              </p>
              <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>
                {row.value}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginBottom: "1.5rem",
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-lg)",
            padding: "1rem",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "var(--color-text-secondary)",
              margin: "0 0 6px",
              fontWeight: 500,
            }}
          >
            Contexto histórico
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
            {c.historicalFacts}
          </p>
        </div>

        <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 10px" }}>
          Praticar com quiz
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          {AXES.map((axis) => (
            <button
              key={axis}
              onClick={() => handleStartQuiz(c, axis)}
              style={{
                padding: "10px 0",
                fontSize: 13,
                borderRadius: "var(--border-radius-md)",
              }}
            >
              {axis} ↗
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "quiz") {
    const q = quizState;
    return (
      <div
        style={{
          padding: "1.5rem 1rem",
          fontFamily: "var(--font-sans)",
          color: "var(--color-text-primary)",
        }}
      >
        <button
          onClick={() => {
            setScreen("read");
            setFeedback(null);
            setTutorMsg("");
          }}
          style={{ marginBottom: "1rem", fontSize: 13 }}
        >
          <i
            className="ti ti-arrow-left"
            aria-hidden="true"
            style={{ marginRight: 4 }}
          ></i>
          Voltar
        </button>

        <div
          style={{
            marginBottom: "0.5rem",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 12,
              padding: "3px 10px",
              background: "#E6F1FB",
              color: "#185FA5",
              borderRadius: "var(--border-radius-md)",
            }}
          >
            {q.axis}
          </span>
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            {q.country.name}
          </span>
        </div>

        <h2
          style={{
            fontSize: 17,
            fontWeight: 500,
            margin: "0 0 1.5rem",
            lineHeight: 1.4,
          }}
        >
          {q.question}
        </h2>

        <div style={{ display: "grid", gap: 8, marginBottom: "1.5rem" }}>
          {q.options.map((opt, i) => {
            let bg = "var(--color-background-primary)";
            let border = "0.5px solid var(--color-border-tertiary)";
            let color = "var(--color-text-primary)";
            if (feedback) {
              if (opt === q.correct) {
                bg = "#EAF3DE";
                border = "1px solid #1D9E75";
                color = "#085041";
              } else if (opt === feedback.chosen) {
                bg = "#FCEBEB";
                border = "1px solid #E24B4A";
                color = "#501313";
              }
            }
            return (
              <button
                key={i}
                disabled={!!feedback}
                onClick={() => handleAnswer(opt)}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  background: bg,
                  border,
                  borderRadius: "var(--border-radius-md)",
                  fontSize: 14,
                  color,
                  cursor: feedback ? "default" : "pointer",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "12px",
              background: feedback.correct ? "#EAF3DE" : "#FCEBEB",
              borderRadius: "var(--border-radius-md)",
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                margin: "0 0 4px",
                color: feedback.correct ? "#085041" : "#501313",
              }}
            >
              <i
                className={`ti ${feedback.correct ? "ti-check" : "ti-x"}`}
                aria-hidden="true"
                style={{ marginRight: 6 }}
              ></i>
              {feedback.msg}
            </p>
          </div>
        )}

        {feedback && (
          <div
            style={{
              padding: "12px",
              background: "var(--color-background-secondary)",
              borderRadius: "var(--border-radius-md)",
              marginBottom: "1rem",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-secondary)",
                margin: "0 0 4px",
                fontWeight: 500,
              }}
            >
              <i
                className="ti ti-robot"
                aria-hidden="true"
                style={{ marginRight: 4 }}
              ></i>
              Feedback do tutor
            </p>
            {loadingTutor ? (
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  margin: 0,
                }}
              >
                Analisando sua resposta...
              </p>
            ) : (
              <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                {tutorMsg}
              </p>
            )}
          </div>
        )}

        {feedback && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <button
              onClick={() => handleStartQuiz(q.country, q.axis)}
              style={{ fontSize: 13 }}
            >
              Nova pergunta
            </button>
            <button onClick={() => setScreen("read")} style={{ fontSize: 13 }}>
              Ver ficha do país
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
