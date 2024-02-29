import React, { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useHistory, useRouteMatch } from "react-router-dom";
import { deleteStory } from "../../data";
import IconDel from "@mui/icons-material/DeleteForever";
import { useRouterContext } from "../../contexts/router_provider";
import { useUserContext } from "../../contexts/user_provider";
import { useBoardContext } from "../route_landings/board";

function ActiveStories(props) {
  // STATES  --------------------
  const [stories, setStories] = useState(props.stories);

  // HOOKS ----------------------
  const { storyRefreshed, showToast, showSpinner, hideSpinner } = useRouterContext();
  const { logout } = useUserContext();
  let { path, url } = useRouteMatch();
  let { is_owner } = useBoardContext();
  const history = useHistory();
  const base_location = window.location.href;

  // EFFECTS --------------------
  useEffect(() => {
    if (storyRefreshed?.action == "end") {
      if (stories.length > 0) {
        setStories((prevStories) => {
          const index = prevStories.findIndex((story) => story.story_id === storyRefreshed.story_id);
          if (index >= 0) {
            prevStories.splice(index, 1);
          }
          return [...prevStories];
        });
      }
    }
    if (storyRefreshed?.action == "revote") {
      setStories((prevStories) => {
        return [storyRefreshed, ...prevStories];
      });

      history.push(`${url}/vote/${storyRefreshed.story_id}`);
    }
  }, [storyRefreshed]);

  // Load the stories basis the host_id
  useEffect(() => {
    if (stories.length > 0 && location.href.indexOf("/result/") == -1) handleOnClick(stories[0].story_id);
  }, [stories.length]);

  // : Append more stories to the list, refresh the list without making api call
  useEffect(() => {
    if (!props.story) return;
    setStories((tempStories) => [props.story, ...tempStories]);
  }, [props.story]);

  // METHODS --------------------
  const handleOnClick = useCallback(
    (story_id) => {
      if (story_id) {
        history.push(`${url}/vote/${story_id}`);
      } else {
        history.push(`${url}`);
      }
    },
    [history]
  );

  // delete a story
  const delStory = (e, story_id) => {
    e.preventDefault();

    showSpinner();
    let delPromise = deleteStory(story_id);
    delPromise
      .then(
        (result) => {
          if (result.status === 204)
            setStories((prevStories) => {
              const index = prevStories.findIndex((story) => story.story_id === story_id);
              prevStories.splice(index, 1);
              return [...prevStories];
            });
          if (stories.length > 0) handleOnClick(stories[0].story_id);
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

  if (stories?.length <= 0) return null;
  return (
    <div className="overflow-hidden grow">
      <div className="flex flex-row overflow-auto pb-2 mt-2">
        {stories.map((story, ind) => {
          return (
            <NavLink
              key={`stories-${ind}`}
              to={`${url}/vote/${story.story_id}`}
              isActive={(match, location) => {
                if (match) return true;
                if (!match) {
                  const term = "/result/";
                  const index = location.pathname.indexOf(term);
                  const value = location.pathname.substring(index + term.length, location.pathname.length);
                  if (value === story.story_id) return true;
                }
                return false;
              }}
              className="rounded-full bg-indigo-200 text-black ml-4"
              activeClassName="bg-indigo-600 text-white">
              <div className={`px-4 py-2 flex flex-row justify-center items-center gap-2 cursor-pointer`}>
                <p className={`whitespace-nowrap`}>{story.story_number}</p>
                {is_owner && <IconDel fontSize="small" color="disabled" className="cursor-pointer" onClick={(e) => delStory(e, story.story_id)} />}
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default ActiveStories;
