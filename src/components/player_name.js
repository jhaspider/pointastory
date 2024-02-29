import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/ModeEdit";

import usePlayerName from "../hooks/use_player_name";

const PlayerName = (props) => {
  const { onNameChange } = props;

  const timeRef = useRef(0);
  const nameRef = useRef(null);
  const [name, setName] = usePlayerName();
  const [isEntryMode, setEntryMode] = useState(true);

  useEffect(() => {
    if (name) {
      if (onNameChange) onNameChange(name);
      setEntryMode(false);
    }
  }, [name]);

  useEffect(() => {
    if (isEntryMode) nameRef.current.focus();
  }, [isEntryMode]);

  const onKeyUpHandler = (e) => {
    if (timeRef.current) clearTimeout(timeRef.current);
    if (e.keyCode === 13) {
      throwDataOut(false);
    } else {
      timeRef.current = setTimeout(() => throwDataOut(true), 2000);
    }
  };

  const throwDataOut = (isTimedOut) => {
    clearTimeout(timeRef.current);
    const enteredName = nameRef.current.value;
    if (onNameChange && enteredName) {
      setName(enteredName);
      onNameChange(enteredName);
    }
  };

  return (
    <div className="vote-as-container">
      {!isEntryMode ? (
        <div className="flex flex-row items-center">
          <p>
            Voting As: <span className="bg-green-100">{name}</span>
          </p>
          <EditIcon className="cursor-pointer text-gray-400 w-4 h-4" onClick={() => setEntryMode(true)} />
        </div>
      ) : (
        <TextField id="outlined-basic" inputProps={{ maxLength: 20 }} fullWidth={false} inputRef={nameRef} size="small" onKeyUp={onKeyUpHandler} label="Enter your name (Optional)" variant="filled" />
      )}
    </div>
  );
};

export default PlayerName;
