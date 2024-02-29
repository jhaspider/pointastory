import React, { useEffect, useState } from "react";

import { useParams, Redirect } from "react-router-dom";
import { useRouterContext } from "../../contexts/router_provider";
import { useUserContext } from "../../contexts/user_provider";
import { addNewHost, getStoriesByBoard } from "../../data";

const Host = () => {
  // STATE
  const [board, setBoard] = useState(null);

  // HOOKS
  let { host_id, board_id } = useParams();
  const { session_id, logout } = useUserContext();
  const { showToast, showSpinner, hideSpinner } = useRouterContext();

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

  useEffect(() => {
    if (board && board.is_owner === false && board.owner_id === host_id) {
      const addAsNewHost = async () => {
        showSpinner();
        try {
          const response = await addNewHost(host_id, board_id);
          if (response === true) {
            setBoard((oldBoardData) => ({ ...board, is_owner: true }));
          }
        } catch (e) {
          showToast(`${e.message}`, "error");
          if (e.code === "F001") logout();
        } finally {
          hideSpinner();
        }
      };
      addAsNewHost();
    }
  }, [board]);

  if (!board) return null;

  if (board.is_owner) return <Redirect to={`/board/${board_id}`} />;

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <h1 className="text-8xl text-center">
        Granting you <br />
        host Access... Pls Wait
      </h1>
    </div>
  );
};

export default Host;
