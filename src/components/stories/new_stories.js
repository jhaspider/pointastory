import React, { useEffect, useRef, useState } from "react";
import useStories from "../../hooks/use_stories";
import { useUserContext } from "../../contexts/user_provider";
import { useRouterContext } from "../../contexts/router_provider";
import useEvent from "../../hooks/use_event";
import { v4 as uuidv4 } from "uuid";
import StoryPill from "./story_pill";
import { createBoard, registerStory } from "../../data";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { SESSION_STORAGE, addToSessionStorage } from "../../utils/session_storage";

const anim_stories = ["ABC-123", "ASN-235", "CDS-545"];

const NewStories = () => {
  // STATES
  const [stories, setStories] = useStories();
  const [new_story, setNewStory] = useState([]);

  const [board_id, setBoardId] = useState(null);

  // HOOKS
  const { session_id, logout } = useUserContext();
  const { showToast, showSpinner, hideSpinner } = useRouterContext();

  let anim = useRef(false);
  const base_location = window.location.href;

  // EFFECTS
  useEffect(() => {
    if (stories.length == 0) playAnimation();
  }, []);

  useEvent("keyup", (e) => {
    // BACKSPACE
    if (e.keyCode === 8) {
      if (new_story.length > 0) {
        new_story.splice(new_story.length - 1, 1);
      } else {
        if (stories.length > 0) {
          stories.splice(stories.length - 1, 1);
          setStories((_) => [...stories]);
        }
      }

      // COMMA, ENTER
    } else if (e.keyCode === 188 || e.keyCode === 13) {
      if (new_story.length <= 0) return;
      // stories.push();
      setStories((_) => [
        ...stories,
        {
          id: uuidv4(),
          anim: anim.current,
          story: new_story.join("").toUpperCase(),
        },
      ]);
      new_story.splice(0, new_story.length);

      // VALID CHARACTERS
    } else {
      if (e.key.length === 1) {
        const only_alpha_pattern = /[a-zA-Z0-9,\-_]/g; // Allowing only number to be captured
        let valid_char = only_alpha_pattern.test(e.key);
        if (valid_char) new_story.push(e.key.toUpperCase());
      }
    }

    setNewStory((_) => [...new_story]);
  });

  // METHODS
  const playAnimation = () => {
    const values = anim_stories.join(",");
    const frames = values + ",".split("");
    anim.current = true;

    let ind = 0;
    const interval = setInterval(() => {
      if (ind < frames.length) {
        if (frames[ind] === ",") {
          document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 188 }));
        } else {
          document.dispatchEvent(new KeyboardEvent("keyup", { key: frames[ind] }));
        }
        ind++;
      } else {
        clearInterval(interval);
        ind = 0;
        const delInterval = setInterval(() => {
          if (ind < anim_stories.length) {
            ind++;
            document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 8 }));
          } else {
            clearInterval(delInterval);
            anim.current = false;
          }
        }, 500);
      }
    }, 50);
  };

  const saveStory = async (e) => {
    e.target.disabled = true;
    if (stories.length <= 0) return;

    showSpinner();
    let board_id;
    try {
      let response = await createBoard();
      board_id = response.board_id;
      addToSessionStorage(SESSION_STORAGE.BOARD_ID, board_id);
      processStoriesSequentially(board_id, () => {
        hideSpinner();
        setStories([]);
        e.target.disabled = false;
        setBoardId(board_id);
      });
    } catch (e) {
      if (e.code === "E001") {
        board_id = e.message.board_id;
      }
      if (e.code === "F001") logout();
    }
  };

  const processStoriesSequentially = (board_id, callback) => {
    let index = 0;
    const processNextStory = () => {
      if (index < stories.length) {
        registerStory(stories[index].story, board_id)
          .then(
            () => {},
            (error) => {
              showToast(error.message, "error");
              if (error.code === "F001") logout();
            }
          )
          .finally(() => {
            index++;
            processNextStory();
          });
      } else {
        // All stories processed
        callback();
      }
    };

    processNextStory();
  };

  const storyRemoveHandler = (story) => {
    const delIndex = stories.findIndex((value) => value.id === story.id);
    if (delIndex < 0) return;

    stories.splice(delIndex, 1);
    setStories((_) => [...stories]);
  };

  if (board_id) return <Redirect to={`/board/${board_id}`} />;

  return (
    <>
      {session_id && (
        <>
          {/* OLD SESSION */}

          {/* ENTER STORIES */}
          <div className="w-full lg:w-[768px] min-h-[400px] bg-green-50 rounded-lg px-10 py-10 flex flex-col justify-center items-center self-center mt-8">
            <h1 className="text-center">Enter Story Numbers</h1>
            <p className="sub-text text-center">Hit Enter/Comma after each story number</p>
            <a href="https://medium.com/@jha-amarjit/use-a-planning-poker-8f6110facb93" target="_blank" className="link my-2">
              HOW DOES IT WORK?
            </a>
            <div className="w-full h-full flex flex-row justify-center items-center flex-wrap my-10 py-8">
              {stories.map((story, ind) => {
                return <StoryPill key={`char-entered-${ind}`} story={story} onRemove={storyRemoveHandler} />;
              })}

              {(stories.length >= 1 || new_story.join("").length >= 1) && (
                <div className={`story-pill rounded-full ${new_story.join("").length >= 1 ? "bg-indigo-200" : ""} px-4 ml-4 mt-4`}>
                  {new_story.join("")}
                  <span className="blinking-cursor text-xl">|</span>
                </div>
              )}

              {stories.length == 0 && new_story.join("").length == 0 && <span className="blinking-cursor text-5xl">|</span>}
            </div>

            {stories.length > 12 && (
              <div className="bg-red-100 w-3/6 px-4 py-1 rounded-lg flex flex-row justify-center items-center self-center gap-4 mt-4 mb-4">
                <p className="text-sm">Up to twelve stories in one go.</p>
              </div>
            )}
            <div className="flex flex-col justify-center items-center">
              <button className="cta primary disabled:opacity-20" disabled={stories.length <= 0 || stories.length > 12 || anim.current === true} onClick={saveStory}>
                CONTINUE
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NewStories;
