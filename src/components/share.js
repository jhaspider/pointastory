import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBoardContext } from "./route_landings/board";

const Share = () => {
  // STATE
  const [open, setOpen] = useState(false);

  // HOOKS
  let { owner_id, board_id } = useBoardContext();
  const base_location = window.location.origin;
  // EFFECTS

  // METHODS
  const shareBoard = async (e, type) => {
    e.target.innerHTML = "✔ COPIED";

    let partcipantLink;
    if (type === "host") partcipantLink = `${base_location}/host/${owner_id}/board/${board_id}`;
    if (type === "participant") partcipantLink = `${base_location}/board/${board_id}`;

    try {
      await navigator.clipboard.writeText(partcipantLink);
    } catch (err) {
      showToast("Failed to copy!", "error");
    }
  };

  const toggleShare = (e) => {
    e.preventDefault();
    setOpen((prevState) => !prevState);
  };

  return (
    <>
      <Link to="" className="link" onClick={toggleShare}>
        SHARE this board
      </Link>
      {open && (
        <div className="absolute top-0 left-0 w-full h-full bg-white z-10">
          <div className="relative w-full h-full">
            <img src="/icons/icon_cross.png" onClick={toggleShare} className="absolute top-6 right-8 w-8 h-8 cursor-pointer" />
            <div className="flex w-full h-full justify-center items-center">
              <div className="flex flex-col items-center justify-center w-full lg:w-3/6 p-8">
                <h2>Share this board with your team</h2>

                {owner_id ? (
                  <>
                    <div className="flex flex-row justify-center gap-8 mt-4">
                      <button className="cta primary" onClick={(e) => shareBoard(e, "host")}>
                        HOST ACCESS
                      </button>

                      <button className="cta primary" onClick={(e) => shareBoard(e, "participant")}>
                        PARTICIPANT ACCESS
                      </button>
                    </div>
                    <p className="mt-4 text-center text-sm">TIP : If you are working remotely share your screen for a greater experience.</p>
                  </>
                ) : (
                  <div className="flex flex-row justify-center mt-4">
                    <button className="cta primary" onClick={(e) => shareBoard(e, "participant")}>
                      SHARE
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Share;
