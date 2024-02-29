import React, { useState, useEffect, lazy } from "react";
import { useRouterContext } from "../../contexts/router_provider";
import { useUserContext } from "../../contexts/user_provider";
import { reVote } from "../../data";
import { useFebo } from "../../hooks/use_febo";
import VoteCount from "../votes/vote_count";

import { Link, useRouteMatch } from "react-router-dom";
import { useBoardContext } from "../route_landings/board";
import { getResultsByStoryId } from "../../data";
import GroupedBubble from "./grouped_bubble";

const BOX_WIDTH = 768;
const BOX_HEIGHT = 576;
const CENTRE_X = BOX_WIDTH / 2;
const CENTRE_Y = BOX_HEIGHT / 2;

const AngleToRadians = (angle) => {
  return (Math.PI / 180) * angle;
};

const calcAngleDegrees = (x, y) => {
  return (Math.atan2(y, x) * 180) / Math.PI;
};

const ReVote = ({ onExecute }) => {
  const [counter, setCounter] = useState(-1);

  useEffect(() => {
    let timeRef = null;
    if (counter > 0) {
      timeRef = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    } else if (counter === 0) {
      clearInterval(timeRef);
      flush();
    } else {
      clearInterval(timeRef);
    }
    return () => {
      clearInterval(timeRef);
    };
  }, [counter]);

  const flush = () => onExecute();

  const revote = () => {
    if (counter < 0) setCounter(3);
    if (counter > 0) setCounter(-1);
  };

  return (
    <button
      className={`cta secondary delete`}
      style={{
        backgroundColor: counter >= 0 ? "#fca5a5" : "white",
      }}
      onClick={revote}>
      {counter == 0 ? "Resetting" : counter > 0 ? `CANCEL (${counter})` : `RE-VOTE`}
    </button>
  );
};

//
const GroupedVotes = (props) => {
  // PROPS
  // STATES
  const [all_votes, setAllVotes] = useState([]);
  const [groupedVotes, setGroupedVotes] = useState([]);

  // HOOKS
  const febonacci = useFebo();
  const { logout } = useUserContext();
  const { is_owner } = useBoardContext();
  const { showToast } = useRouterContext();
  let { path, url } = useRouteMatch();
  const base_location = window.location.href;
  // EFFECTS
  useEffect(() => {
    let resultPromise = getResultsByStoryId(props.story_id);
    resultPromise.then(
      (result) => {
        setAllVotes([...result.data]);
      },
      (error) => {
        showToast(`${error.message}`, "error");
        if (error.code === "F001") {
          logout();
          location.href = base_location;
        }
      }
    );

    return () => {};
  }, [props.story_id]);

  useEffect(() => {
    if (all_votes.length > 0) {
      renderGroupedVotes();
    }
    return () => {};
  }, [all_votes]);

  // METHODS
  const renderGroupedVotes = () => {
    let gVotes = [];
    for (let i = 0; i < febonacci.length; i++) {
      let feboNumber = febonacci[i];
      let filtered = all_votes.filter((vote) => vote.story_point == feboNumber);
      gVotes.push({
        story_point: feboNumber,
        count: filtered.length,
        voters: filtered,
      });
    }

    // Sort the array by votes
    gVotes.sort((a, b) => (a.count < b.count ? 1 : b.count < a.count ? -1 : 0));

    if (gVotes.length > 0) {
      let topVoteCount = gVotes[0].count;
      let angle = 0;
      let sharedTopVoteCount = gVotes.filter((vote) => vote.count === topVoteCount);

      // Decide the size of the circles
      const MIN_CIRCLE_SIZE = 100;
      const MAX_CIRCLE_SIZE = sharedTopVoteCount.length > 1 ? 200 : 300;
      const DIST = MAX_CIRCLE_SIZE / 2 + (sharedTopVoteCount.length > 1 ? 60 : 30);

      // TRY OPTION 2 based on vote counts
      let interval = Math.round(MAX_CIRCLE_SIZE / topVoteCount);
      let dimension = MAX_CIRCLE_SIZE;

      gVotes[0] = {
        ...gVotes[0],
        dimension,
        initial: { left: CENTRE_X, top: CENTRE_Y },
        final: { left: CENTRE_X, top: CENTRE_Y },
        zIndex: gVotes.length,
        pop: true,
      };

      for (let i = 1; i < gVotes.length; i++) {
        if (gVotes[i].count < gVotes[i - 1].count) dimension = gVotes[i].count * interval;
        if (dimension < MIN_CIRCLE_SIZE) dimension = MIN_CIRCLE_SIZE;

        if (i > 1) {
          let prevItem = gVotes[i - 1];
          let cord = {
            x: prevItem.final.left - prevItem.dimension / 2,
            y: prevItem.final.top + prevItem.dimension / 2,
          };
          let new_angle = Math.ceil(calcAngleDegrees(cord.x - CENTRE_X, cord.y - CENTRE_Y));
          angle = Math.max(angle + 35, new_angle);
        }

        let finalX = CENTRE_X + DIST * Math.cos(AngleToRadians(angle));
        let finalY = CENTRE_Y + DIST * Math.sin(AngleToRadians(angle));

        gVotes[i] = {
          ...gVotes[i],
          dimension,
          initial: {
            left: CENTRE_X,
            top: CENTRE_Y,
          },
          final: {
            left: finalX,
            top: finalY,
          },
          zIndex: gVotes.length - i,
        };
      }
    }

    setGroupedVotes(gVotes);
  };

  const revote = async () => {
    const data = await reVote(props.story_id);
  };

  return (
    <>
      <div className="flex flex-col w-full h-full justify-start items-center">
        <div className="w-[768px] grow mt-2 relative">
          <VoteCount total_vote_count={all_votes.length} />
          {groupedVotes.map((gVote, index) => {
            return <GroupedBubble key={`vote-elipses-${index}`} index={index} vote={gVote} />;
          })}
        </div>
        <div className="py-1">{is_owner && <ReVote onExecute={revote} />}</div>
      </div>
    </>
  );
};

export default GroupedVotes;
