import React, { useEffect, useState } from "react";
import { NavLink, useHistory, useRouteMatch } from "react-router-dom";
import { useRouterContext } from "../../contexts/router_provider";
import { getStoriesByBoard } from "../../data";
import { useBoardContext } from "../route_landings/board";

const CompletedStories = (props) => {
  // STATES
  const [stories, setStories] = useState([]);

  // HOOKS
  const { storyRefreshed } = useRouterContext();
  const { board_id } = useBoardContext();
  let { path, url } = useRouteMatch();
  const history = useHistory();
  // EFFECTS
  useEffect(async () => {
    try {
      const response = await getStoriesByBoard(board_id, "closed");
      setStories((prevData) => [...prevData, ...response.data]);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (storyRefreshed?.action == "end") {
      setStories((prevStories) => {
        return [storyRefreshed, ...prevStories];
      });
      history.push(`${url}/result/${storyRefreshed.story_id}`);
    }
    if (storyRefreshed?.action == "revote") {
      setStories((prevStories) => {
        const index = prevStories.findIndex((story) => story.story_id === storyRefreshed.story_id);
        if (index >= 0) {
          prevStories.splice(index, 1);
        }
        return [...prevStories];
      });
    }
  }, [storyRefreshed]);

  // METHODS

  if (stories.length > 0)
    return (
      <>
        <div className="flex flex-col items-center my-4">
          <h3>COMPLETED STORIES</h3>

          <div className="w-full md:w-[768px] flex flex-row items-center justify-center flex-wrap gap-4">
            {stories.map((story, ind) => {
              return (
                <NavLink key={`stories-completed-${story.story_id}`} to={`${url}/result/${story.story_id}`} className={`rounded-full mt-4 bg-indigo-200`} activeClassName="!bg-gray-400">
                  <div className={`px-4 py-2 flex flex-row justify-center items-center gap-2 cursor-pointer`}>
                    <p className={`text-black whitespace-nowrap`}>{story.story_number}</p>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </>
    );
  return null;
};

export default CompletedStories;
