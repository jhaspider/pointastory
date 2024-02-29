import React, { lazy, useEffect, useRef, useState } from "react";
import { getStoryById, castVote } from "../../data";
import { useRouterContext } from "../../contexts/router_provider";

import { useFebo } from "../../hooks/use_febo";
import { useUserContext } from "../../contexts/user_provider";
import { useBoardContext } from "../route_landings/board";
import { useParams, useRouteMatch } from "react-router-dom";

import PlayerName from "../player_name";

export default function Votes(props) {
  // STATES
  let { onVoteSubmitted } = props;
  const [selected_size, setSelectedSize] = useState(0);
  const [story, setStory] = useState(null);

  // HOOKS
  const { is_owner } = useBoardContext();
  const { showToast, showSpinner, hideSpinner } = useRouterContext();
  const { logout } = useUserContext();
  const febonacci = useFebo();
  const playerName = useRef("");
  let { story_id } = useParams();
  let { path, url } = useRouteMatch();
  const base_location = window.location.href;

  // EFFECTS
  useEffect(() => {
    (async () => {
      try {
        const data = await getStoryById(story_id);
        setStory(data);
      } catch (e) {
        console.error(e);
        if (e.code === "F001") logout();
      }
    })();
  }, [story_id]);

  // METHODS
  const saveHandler = () => {
    if (selected_size <= 0) {
      showToast(`Select a number.`, "error");
      return;
    }

    showSpinner();
    let castPromise = castVote(story.story_id, selected_size, playerName?.current);
    castPromise
      .then(
        (_) => {
          if (onVoteSubmitted) onVoteSubmitted(story.story_id);
        },
        (error) => {
          showToast(`${error.message}`, "error");
          if (error.code === "F001") {
            logout();
            location.href = base_location;
          }
        }
      )
      .finally(() => hideSpinner());
  };

  const skipHandler = () => {
    if (onVoteSubmitted) onVoteSubmitted(story.story_id);
  };

  if (!story) return null;

  return (
    <div className="w-2/4 flex flex-col justify-center items-center py-10">
      <h3>CAST YOUR VOTE</h3>
      {febonacci.length > 0 && (
        <div className="grid-container mt-4">
          {febonacci.map((value, ind) => {
            return (
              <div className={`grid-item ${value == selected_size ? "selected-color" : "normal"}`} key={`grid-cell-${ind}`} onClick={() => setSelectedSize(value)}>
                {value}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <PlayerName onNameChange={(name) => (playerName.current = name)} />
      </div>

      <div className="flex flex-row justify-center items-center mt-4">
        {is_owner && (
          <button className="cta secondary" onClick={skipHandler}>
            Pass
          </button>
        )}
        <button className="cta primary ml-4" onClick={saveHandler}>
          Submit
        </button>
      </div>
    </div>
  );
}
