import CircularProgress from "@mui/material/CircularProgress";
import React, { useState } from "react";
import { Util_f } from "../../utils/utilities";

export default function Spinner() {
  const [color] = useState(() => {
    return Util_f.randomColor();
  });

  return (
    <div
      className="spinner absolute top-2/4 left-2/4 p-4 rounded-lg"
      style={{
        backgroundColor: color,
      }}>
      <CircularProgress variant="indeterminate" color="secondary" size={24} />
    </div>
  );
}
