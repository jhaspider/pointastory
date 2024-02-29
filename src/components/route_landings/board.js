import React, { useContext, useEffect, useState } from "react";
import { Route, useHistory, useLocation, useParams, useRouteMatch } from "react-router-dom";
import Share from "../share";
import ActiveStories from "../stories/active_stories";
import AddStory from "../stories/add_story";
import CompletedStories from "../stories/completed_stories";
import { useRouterContext } from "../../contexts/router_provider";
import { useUserContext } from "../../contexts/user_provider";
import { getStoriesByBoard } from "../../data";
import Logo from "../elements/logo";
import HeaderFooterLayout from "../../components/layouts/header_footer_layout";
import Result from "../results/result";
import Votes from "../votes/votes";

const BoardContext = React.createContext();

export const useBoardContext = () => {
  return useContext(BoardContext);
};

const Board = () => {
  // STATE
  const [board, setBoard] = useState(null);
  const [story, setStory] = useState();

  // HOOKS
  let { board_id } = useParams();
  const { session_id, logout } = useUserContext();
  const { showToast, showSpinner, hideSpinner } = useRouterContext();
  const base_location = window.location.href;
  let { path, url } = useRouteMatch();

  let history = useHistory();
  const location = useLocation();
  // EFFECTS
  useEffect(async () => {
    if (session_id && board_id) {
      try {
        const response = await getStoriesByBoard(board_id);
        setBoard(response);
      } catch (e) {
        showToast(`${e.message}`, "error");
        if (e.code === "F001") logout();
      } finally {
        hideSpinner();
      }
      return;
    }
  }, [session_id, board_id]);

  // METHODS
  if (!session_id) {
    return (
      <HeaderFooterLayout>
        <div className="h-[calc(100vh-6rem)]"></div>
      </HeaderFooterLayout>
    );
  }

  const voteHandler = (story_id) => history.push(`${url}/result/${story_id}`);

  const onStoryAdded = (new_story) => setStory(new_story);

  if (session_id && board) {
    return (
      <BoardContext.Provider
        value={{
          is_owner: board.is_owner,
          owner_id: board.owner_id,
          board_id,
        }}>
        <div className="flex flex-col w-full">
          <div className="h-12 bg-white flex flex-row justify-start items-center px-8 py-2 bg-gray-50">
            <div className="grow flex items-start">
              <Logo />
            </div>
            <div className="grow-0 flex flex-row justify-center items-center gap-2 shrink-0 px-2 py-1">
              <Share />
            </div>
          </div>

          <div className="w-full flex flex-row justify-center items-center px-2 lg:px-0 story-panel">
            <div className="w-full lg:w-[768px] px-10 flex flex-row justify-center items-center py-2 gap-2">
              {board.is_owner && <AddStory onStoryAdded={onStoryAdded} />}
              <ActiveStories stories={board.data} story={story} />
            </div>
          </div>
          <div className="flex h-[600px] justify-center items-center">
            <Route path={`${path}/vote/:story_id`}>
              <Votes onVoteSubmitted={voteHandler} />
            </Route>
            <Route path={`${path}/result/:story_id`}>
              <Result />
            </Route>
          </div>

          <div className="pt-4 absolute bottom-0 w-full flex flex-col justify-start items-center bg-gray-100 min-h-96">
            <CompletedStories />
          </div>
        </div>
      </BoardContext.Provider>
    );
  }

  return null;
};

export default Board;
