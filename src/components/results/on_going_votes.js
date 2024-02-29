import React, { useState, useEffect, lazy, useRef } from "react";
import { useRouterContext } from "../../contexts/router_provider";
import { useUserContext } from "../../contexts/user_provider";
import { endVote, getOnGoingRealTimeVotes } from "../../data";
import VoteCount from "../votes/vote_count";

import { useBoardContext } from "../route_landings/board";
import VotesBubble from "./votes_bubble";

// CONST
const BOX_WIDTH = 768;
const BOX_HEIGHT = 576;
const CIRCLE_DIM = 80;
const CELL_SIZE = 80 + 20;
const GRID_COLS = Math.floor((BOX_WIDTH - 80) / CELL_SIZE);
const GRID_ROWS = Math.floor((BOX_HEIGHT - 80) / CELL_SIZE);
let ARRAY_CELLS;

function getCords(all_votes) {
  let centreCord = {
    left: BOX_WIDTH / 2 - CELL_SIZE / 2,
    top: BOX_HEIGHT / 2 - CELL_SIZE / 2,
  };

  let i = 0;

  let startXPos = (BOX_WIDTH - GRID_COLS * CELL_SIZE) / 2;
  let startYPos = (BOX_HEIGHT - GRID_ROWS * CELL_SIZE) / 2;

  while (i < all_votes.length) {
    if (all_votes[i].initCord) {
      i++;
      continue;
    }

    let randomIndex = Math.floor(Math.random() * ARRAY_CELLS.length);
    const tile = ARRAY_CELLS[randomIndex];
    let ROW = Math.floor(tile / GRID_COLS);
    let COL = Math.floor(tile % GRID_COLS);
    if (COL == 0) {
      ROW--;
      COL = GRID_COLS;
    }

    let initCord = {
      left: startXPos + (COL - 1) * CELL_SIZE,
      top: startYPos + ROW * CELL_SIZE,
      cell_size: CELL_SIZE,
    };

    ARRAY_CELLS.splice(randomIndex, 1);

    let newObj = {
      ...all_votes[i],
      dimension: CIRCLE_DIM,
      initDimension: 0,
      initCord,
      centreCord,
    };
    all_votes.splice(i, 1, newObj);

    i++;
  }

  return all_votes;
}

const OnGoingVotes = (props) => {
  // PROPS
  let { story_id, result_state } = props;

  // STATE
  const [votes, setVotes] = useState([]);
  const [resultState, setResultState] = useState("votes");

  // HOOKS
  const { showToast } = useRouterContext();
  const { logout } = useUserContext();
  const { is_owner } = useBoardContext();
  const base_location = window.location.href;

  // EFFECTS
  useEffect(() => {
    ARRAY_CELLS = Array(GRID_COLS * GRID_ROWS)
      .fill()
      .map((_, idx) => idx + 1);

    let unsubscribe;
    (async () => {
      try {
        unsubscribe = await getOnGoingRealTimeVotes(story_id, (newVotes) => {
          if (newVotes) {
            setVotes((prevVotes) => {
              return [...prevVotes, ...newVotes];
            });
          }
        });
      } catch (e) {}
    })();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setResultState(result_state);
  }, [result_state]);

  useEffect(() => {
    if (votes.length > 0) {
      let new_votes = getCords(votes);
      setVotes([...new_votes]);
    }

    return () => {};
  }, [votes.length]);

  // METHODS...
  const endVotingHandler = async (e) => {
    if (e) e.target.disabled = true;

    let endVotePromise = endVote(story_id);
    endVotePromise.then(
      (_) => {},
      (error) => {
        showToast(`${error.message}`, "error");
        if (error.code === "F001") {
          logout();
          location.href = base_location;
        }
      }
    );
  };

  // return null;
  return (
    <>
      <div className="flex flex-col w-full h-full justify-start items-center gap-4">
        <div className="relative flex w-[768px] h-[576px] mt-2 lg:border rounded-lg overflow-hidden">
          <VoteCount total_vote_count={votes?.length} />
          {votes && (
            <>
              {votes?.length > 0 ? (
                votes.map((vote, index) => {
                  return <VotesBubble key={`vote-elipses-${index}`} resultState={resultState} vote={vote} />;
                })
              ) : (
                <p className="text-sm self-center text-center w-full">Votes will appear here.</p>
              )}
            </>
          )}
        </div>

        <div className="py-4">
          {votes?.length > 0 && (
            <>
              {is_owner ? (
                <button className="cta primary" onClick={endVotingHandler}>
                  REVEAL
                </button>
              ) : (
                <p className="text-sm">The team member hosting this will close the voting to reveal the result.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OnGoingVotes;
