import { useProficiency } from "./hooks/useProficiency.js";
import { useQuizState } from "./hooks/useQuizState.js";
import { useTutorFeedback } from "./hooks/useTutorFeedback.js";
import { useScreenNavigation } from "./hooks/useScreenNavigation.js";
import HomeScreen from "./components/HomeScreen.jsx";
import ReadScreen from "./components/ReadScreen.jsx";
import QuizScreen from "./components/QuizScreen.jsx";
import watermark from "/watermark.svg";

export default function App() {
  // State management hooks
  const {
    proficiency,
    badges,
    addProficiency,
    totalCompleted,
    avgProficiency,
  } = useProficiency();

  const { quizState, startQuiz, recordRead, getReadCount } = useQuizState();

  const { tutorMsg, loadingTutor, fetchFeedback, reset: resetTutor } =
    useTutorFeedback();

  const { screen, selectedCountry, goHome, goToRead, goToQuiz } =
    useScreenNavigation();

  // Event handlers
  const handleSelectCountry = (country) => {
    const reads = recordRead(country.name);
    if (reads) {
      addProficiency(country.name, 10);
    }
    goToRead(country);
  };

  const handleStartQuiz = (country, axis) => {
    startQuiz(country, axis);
    goToQuiz(country, axis);
  };

  const handleAnswer = async (option, isCorrect) => {
    if (isCorrect) {
      addProficiency(quizState.country.name, 35);
    }
    await fetchFeedback(quizState, option, isCorrect);
  };

  const handleBackFromQuiz = () => {
    resetTutor();
    goToRead(selectedCountry);
  };

  const handleBackFromRead = () => {
    goHome();
  };

  const handleNewQuestion = () => {
    const { country, axis } = quizState;
    startQuiz(country, axis);
  };

  let content;

  switch (screen) {
  case "home":
    content = <HomeScreen
      proficiency={proficiency}
      badges={badges}
      totalCompleted={totalCompleted}
      avgProficiency={avgProficiency}
      onSelectCountry={handleSelectCountry}
    />;
    break;

  case "read":
    content =
    <ReadScreen
      country={selectedCountry}
      proficiency={proficiency}
      readCount={getReadCount(selectedCountry.name)}
      onStartQuiz={handleStartQuiz}
      onBack={handleBackFromRead}
    />;
    break;

  case "quiz":
    content =
    <QuizScreen
      quizState={quizState}
      tutorMsg={tutorMsg}
      loadingTutor={loadingTutor}
      onAnswer={handleAnswer}
      onNewQuestion={handleNewQuestion}
      onBack={handleBackFromQuiz}
    />;
    break;

  default:
    content = null;
  }

  return (
    <div className="relative min-h-screen">
      <img
        src={watermark}
        alt=""
        aria-hidden="true"
        className="fixed inset-0 w-screen h-screen object-cover opacity-10 pointer-events-none -z-10"
      />

      {content}
    </div>
  );
}
