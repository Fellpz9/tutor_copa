import { AXES } from "../quiz_data.js";
import Button from "./shared/Button.jsx";
import Card from "./shared/Card.jsx";
import ProgressBar from "./shared/ProgressBar.jsx";

export default function ReadScreen({
  country,
  proficiency,
  readCount,
  onStartQuiz,
  onBack,
}) {
  const p = proficiency[country.name] || 0;
  const canRead = readCount < 3;

  return (
    <div className="px-4 py-6 md:px-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <i className="ti ti-arrow-left" style={{ marginRight: 4 }} />
          Voltar
        </Button>

        <div className="flex justify-between items-center mb-1">
          <h2 className="text-2xl font-semibold">{country.name}</h2>
          <span className="text-sm text-gray-500">{p}% concluído</span>
        </div>
        <ProgressBar
          progress={p}
          isComplete={p >= 100}
          className="h-1.5 mb-6"
        />

        {canRead && (
          <div className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900 rounded-lg p-3 mb-4">
            <i className="ti ti-info-circle" style={{ marginRight: 4 }} />
            Leitura contabiliza +10% de proficiência (máx. 30% por leitura).
          </div>
        )}

        <Card className="mb-6">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
            📚 Contexto histórico
          </p>
          <p className="text-sm leading-relaxed">{country.historicalFacts}</p>
        </Card>

        <p className="text-sm font-semibold mb-3">🎯 Praticar com quiz</p>
        <div className="grid grid-cols-3 gap-2">
          {AXES.map((axis) => (
            <Button
              key={axis}
              onClick={() => onStartQuiz(country, axis)}
            >
              {axis} ↗
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
