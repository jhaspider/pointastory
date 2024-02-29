import { useEffect, useState } from "react";

const getValueFromStore = (initialValue) => {
  if (initialValue && initialValue != "") {
    localStorage.setItem("playerName", JSON.stringify(initialValue));
    return initialValue;
  } else {
    const playerName = JSON.parse(localStorage.getItem("playerName"));
    if (playerName) return playerName;
  }
  return;
};

const usePlayerName = (initialValue) => {
  const [name, setName] = useState(() => {
    return getValueFromStore(initialValue);
  });

  useEffect(() => {
    if (name) {
      localStorage.setItem("playerName", JSON.stringify(name));
    }
  }, [name]);

  return [name, setName];
};

export default usePlayerName;
