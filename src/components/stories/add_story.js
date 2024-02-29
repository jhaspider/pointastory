import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useBoardContext } from "../route_landings/board";
import { registerStory } from "../../data";
import { useRouterContext } from "../../contexts/router_provider";

function AddStory({ onStoryAdded }) {
  // STATES
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [new_story, setNewStory] = useState(null);

  // HOOKS
  let { owner_id, board_id } = useBoardContext();
  const { showToast, showSpinner, hideSpinner } = useRouterContext();

  // EFFECTS
  useEffect(() => {
    if (open === false && new_story !== null && onStoryAdded) {
      onStoryAdded(new_story);
    }
  }, [open]);

  // METHODS
  const toggleOpenState = () => setOpen((prevState) => !prevState);

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) handleAdd();
  };

  const handleAdd = async () => {
    if (owner_id && board_id && value !== "") {
      showSpinner();
      try {
        let data = await registerStory(value.toUpperCase(), board_id);
        setNewStory(data);
      } catch (error) {
        showToast(error.message, "error");

        if (error.code === "F001") logout();
      } finally {
        hideSpinner();
        toggleOpenState();
      }
    }
  };

  const handleInput = (e) => setValue(e.target.value);

  return (
    <div>
      <div className="grow-0 shrink-0 bg-white cursor-pointer" onClick={toggleOpenState}>
        <div className="flex flex-row justify-center items-center gap-2 shrink-0 px-2 py-1">
          <img src="/icons/icon_add.png" className="w-6 h-6" />
          <p className="text-sm whitespace-nowrap">Add a Story</p>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={toggleOpenState}
        PaperProps={{
          style: {
            width: 400,
          },
        }}>
        <DialogTitle>Add New Story</DialogTitle>
        <DialogContent>
          <div className="flex flex-col mt-8">
            <TextField
              autoFocus
              inputProps={{ style: { textTransform: "uppercase" }, maxLength: 20 }}
              onKeyUp={handleKeyUp}
              onChange={handleInput}
              label="Story No."
              helperText="eg. ABC-123"
              fullWidth
              size="small"
              variant="filled"
            />
            <div className="flex flex-row gap-2 py-4">
              <button className="cta primary small disabled:opacity-20" disabled={value.length <= 0} onClick={handleAdd}>
                ADD
              </button>
              <button className="cta secondary small disabled:opacity-20 text-gray-400" onClick={toggleOpenState}>
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddStory;
