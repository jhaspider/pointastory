import React, { useEffect, useState } from "react";
import { SESSION_STORAGE, addToSessionStorage, getFromSessionStorage } from "../utils/session_storage";

function getStories() {
  const stories = getFromSessionStorage(SESSION_STORAGE.NEW_STORIES);
  return stories && stories !== "null" ? JSON.parse(stories) : [];
}

function updateStories(stories) {
  stories = stories.filter((story) => story.anim == false);
  addToSessionStorage(SESSION_STORAGE.NEW_STORIES, JSON.stringify(stories));
}

const useStories = () => {
  const [stories, setStories] = useState(() => {
    return getStories();
  });

  useEffect(() => {
    updateStories(stories);
  }, [stories]);

  return [stories, setStories];
};

export default useStories;
