const SESSION_STORAGE = {
  BOARD_ID: "board_id",
  NEW_STORIES: "new_stories",
};
const addToSessionStorage = (key, value) => {
  sessionStorage.setItem(key, value);
};

function getFromSessionStorage(key) {
  const value = sessionStorage.getItem(key);
  return value && value !== "null" ? value : "";
}

function flushAllSessions() {
  sessionStorage.removeItem(SESSION_STORAGE.BOARD_ID);
  sessionStorage.removeItem(SESSION_STORAGE.NEW_STORIES);
}

export { SESSION_STORAGE, addToSessionStorage, getFromSessionStorage, flushAllSessions };
