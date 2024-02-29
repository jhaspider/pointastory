import React, { lazy, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRouterContext } from "../../contexts/router_provider";
import { useUserContext } from "../../contexts/user_provider";
import { getOnGoingVoteStatus, getStoryById } from "../../data";
import OnGoingVotes from "./on_going_votes";
import GroupedVotes from "./grouped_votes";

export default function Result(props) {
  // PROPS

  // STATES
  const [story, setStory] = useState(null);
  const [result_state, setResultState] = useState("vote");

  // HOOKS
  const { refreshStories } = useRouterContext();
  const { logout } = useUserContext();
  let { story_id } = useParams();
  const base_location = window.location.href;

  // EFFECTS
  useEffect(() => {
    (async () => {
      try {
        const data = await getStoryById(story_id);
        setStory(data);
      } catch (e) {
        if (e.code === "F001") logout();
      }
    })();
  }, [story_id]);

  useEffect(() => {
    let timeRef = null;
    let unsubscribe;
    if (story?.story_id) {
      (async () => {
        try {
          unsubscribe = await getOnGoingVoteStatus(story?.story_id, (result) => {
            if (result) {
              if (result.status === 1) {
                // End
                setResultState("summary");
                timeRef = setTimeout(() => {
                  setStory((prevStory) => ({ ...prevStory, status: 1, action: "end" }));
                }, 500);
              } else if (result.status === 0) {
                // Revote
                setStory((prevStory) => ({ ...prevStory, status: 0, action: result?.revote ? "revote" : "progress" }));
              }
            }
          });
        } catch (e) {}
      })();
    }

    return () => {
      if (timeRef) clearTimeout(timeRef);
      if (unsubscribe) unsubscribe();
    };
  }, [story?.story_id]);

  useEffect(() => {
    if (story?.action === "end" || story?.action === "revote") {
      refreshStories(story);
    }

    return () => {};
  }, [story?.action]);

  // METHODS

  // RETURN

  if (!story) return null;

  return (
    <div className="relative flex flex-col w-full h-full justify-center items-center">
      {story && story?.status == 0 && <OnGoingVotes result_state={result_state} story_id={story?.story_id} />}

      {story && story?.status == 1 && <GroupedVotes story_id={story?.story_id} />}
    </div>
  );
}
