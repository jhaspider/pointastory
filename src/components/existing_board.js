import React, { useEffect, useRef, useState } from "react";
import { useUserContext } from "../contexts/user_provider";
import { getAllStories } from "../data";
import { SESSION_STORAGE, getFromSessionStorage } from "../utils/session_storage";
import { Link } from "react-router-dom";

const ExistingBoardStories = () => {
  const { session_id, logout } = useUserContext();
  const [board_id, setBoardId] = useState(null);

  useEffect(() => {
    if (session_id) {
      const old_board_id = getFromSessionStorage(SESSION_STORAGE.BOARD_ID);
      if (old_board_id) {
        let storiesPromise = getAllStories(old_board_id);
        storiesPromise.then(
          (result) => {
            if (result.data.length > 0) {
              setBoardId(result.data[0].board_id);
            }
          },
          (error) => {
            if (error.code === "F001") logout();
          }
        );
      }
    }
  }, []);

  const onLogoutTap = (e) => {
    e.preventDefault();
    logout();
  };

  if (board_id)
    return (
      <div className="bg-yellow-100 px-4 py-2 rounded-lg w-full lg:w-[768px] flex flex-col md:flex-row justify-center items-center  gap-4  self-center mt-4">
        <p>System detected an unfinished session.</p>
        <Link to={`/board/${board_id}`} className="link">
          GO TO OLD SESSION
        </Link>
        <Link to={``} onClick={onLogoutTap} className="link">
          FLUSH OLD SESSION
        </Link>
      </div>
    );
  return null;
};

export default ExistingBoardStories;
