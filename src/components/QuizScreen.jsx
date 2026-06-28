import { useState } from "react";
import Button from "./shared/Button.jsx";
import Card from "./shared/Card.jsx";

export default function QuizScreen({
  quizState,
  tutorMsg,
  loadingTutor,
  onAnswer,
  onNewQuestion,
  onBack,
}) {
  const [feedback, setFeedback] = useState(null);
  const q = quizState;

  const handleAnswer = async (option) => {
    const isCorrect = option === q.correct;
    setFeedback({
      correct: isCorrect,
      chosen: option,
      msg: isCorrect
        ? `Correto! A resposta é: ${q.correct}`
        : `Incorreto. A resposta correta é: ${q.correct}`,
    });
    await onAnswer(option, isCorrect);
  };

  const handleNewQuestion = () => {
    setFeedback(null);
    onNewQuestion();
  };

  return (
    <div className="px-4 py-6 md:px-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <i className="ti ti-arrow-left" style={{ marginRight: 4 }} />
          Voltar
        </Button>

        <div className="mb-2 flex gap-2 items-center">
          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg">
            {q.axis}
          </span>
          <span className="text-sm text-gray-500">{q.country.name}</span>
        </div>

        <h2 className="text-lg font-semibold leading-relaxed mb-6">
          {q.question}
        </h2>

        <div className="space-y-2 mb-6">
          {q.options.map((opt, i) => {
            let bgClass =
              "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600";
            let textClass = "text-gray-900 dark:text-white";

            if (feedback) {
              if (opt === q.correct) {
                bgClass = "bg-green-50 dark:bg-green-900 border-2 border-success";
                textClass = "text-green-900 dark:text-green-100";
              } else if (opt === feedback.chosen) {
                bgClass = "bg-red-50 dark:bg-red-900 border-2 border-error";
                textClass = "text-red-900 dark:text-red-100";
              }
            }

            return (
              <button
                key={i}
                disabled={!!feedback}
                onClick={() => handleAnswer(opt)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${bgClass} ${textClass} ${
                  !feedback && "hover:shadow-md cursor-pointer"
                } ${feedback && "cursor-default"}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {feedback && (
          <Card
            className={`mb-4 ${
              feedback.correct
                ? "bg-green-50 dark:bg-green-900"
                : "bg-red-50 dark:bg-red-900"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                feedback.correct
                  ? "text-green-900 dark:text-green-100"
                  : "text-red-900 dark:text-red-100"
              }`}
            >
              <i
                className={`ti ${feedback.correct ? "ti-check" : "ti-x"}`}
                style={{ marginRight: 6 }}
              />
              {feedback.msg}
            </p>
          </Card>
        )}

        {feedback && (
          <Card className="mb-4">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
              <i className="ti ti-robot" style={{ marginRight: 4 }} />
              Feedback do tutor
            </p>
            {loadingTutor ? (
              <p className="text-sm text-gray-500">
                Analisando sua resposta...
              </p>
            ) : (
              <p className="text-sm leading-relaxed">{tutorMsg}</p>
            )}
          </Card>
        )}

        {feedback && (
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleNewQuestion}>Nova pergunta</Button>
            <Button variant="secondary" onClick={onBack}>
              Ver ficha do país
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
