import { useState } from "react";
import { COUNTRIES } from "../countries.js";
import Button from "./shared/Button.jsx";
import Card from "./shared/Card.jsx";
import ProgressBar from "./shared/ProgressBar.jsx";

export default function HomeScreen({
  proficiency,
  badges,
  totalCompleted,
  avgProficiency,
  onSelectCountry,
}) {
  const [filterContinent, setFilterContinent] = useState("Todos");

  const continents = [
    "Todos",
    ...Array.from(new Set(COUNTRIES.map((c) => c.continent))),
  ].sort();

  const filteredCountries =
    filterContinent === "Todos"
      ? COUNTRIES
      : COUNTRIES.filter((c) => c.continent === filterContinent);

  return (
    <div className="px-4 py-6 md:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl text-amber-300 font-semibold mb-1">Copa do Mundo 2026</h2>
        <p className="text-sm text-gray-500 mb-6">Sistema de Tutor Inteligente</p>

        <div className="flex gap-3 mb-6">
          {[
            {
              label: "Países disponíveis",
              value: COUNTRIES.length,
              icon: "🌍",
            },
            { label: "Países concluídos", value: totalCompleted, icon: "✅" },
            {
              label: "Proficiência média",
              value: `${avgProficiency}%`,
              icon: "📊",
            },
          ].map((m) => (
            <Card key={m.label} className="text-center">
              <p className="text-2xl mb-1">{m.icon}</p>
              <p className="text-xl font-semibold mb-1">{m.value}</p>
              <p className="text-xs text-gray-500">{m.label}</p>
            </Card>
          ))}
        </div>

        {badges.length > 0 && (
          <Card className="mb-6">
            <p className="text-sm font-medium mb-3">🏆 Insígnias conquistadas</p>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg"
                >
                  <i className="ti ti-trophy" style={{ marginRight: 4 }} />
                  {b}
                </span>
              ))}
            </div>
          </Card>
        )}

        <div className="flex items-center gap-2 mb-4">
          <label className="text-sm text-gray-500">Filtrar por:</label>
          <select
            value={filterContinent}
            onChange={(e) => setFilterContinent(e.target.value)}
            className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
          >
            {continents.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredCountries.map((country) => {
            const p = proficiency[country.name] || 0;
            const done = p >= 100;
            return (
              <Card
                key={country.name}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  done
                    ? "border-2 border-success"
                    : "border border-gray-300 dark:border-gray-600"
                }`}
                onClick={() => onSelectCountry(country)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">{country.name}</span>
                  {done && (
                    <i className="ti ti-rosette text-success text-lg" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {country.continent}
                </p>
                <ProgressBar progress={p} isComplete={done} className="mb-2" />
                <p className="text-xs text-gray-500 text-right">{p}%</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
