import { useState } from "react";

export function useScreenNavigation() {
  const [screen, setScreen] = useState("home");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAxis, setSelectedAxis] = useState(null);

  const goHome = () => {
    setScreen("home");
    setSelectedCountry(null);
    setSelectedAxis(null);
  };

  const goToRead = (country) => {
    setSelectedCountry(country);
    setSelectedAxis(null);
    setScreen("read");
  };

  const goToQuiz = (country, axis) => {
    setSelectedCountry(country);
    setSelectedAxis(axis);
    setScreen("quiz");
  };

  return {
    screen,
    setScreen,
    selectedCountry,
    selectedAxis,
    goHome,
    goToRead,
    goToQuiz,
  };
}
