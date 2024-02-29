import React from "react";
import IconDel from "@mui/icons-material/DeleteForever";

const StoryPill = ({ story, onRemove }) => {
  return (
    <div className="story-pill rounded-full bg-indigo-200 px-4 ml-4 mt-4 flex flex-row justify-center items-center gap-2">
      {story.story}
      <IconDel fontSize="small" color="disabled" className="cursor-pointer" onClick={(e) => onRemove(story)} />
    </div>
  );
};

export default StoryPill;
