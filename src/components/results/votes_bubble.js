import React, { useEffect, useState } from "react";
import { Util_f } from "../../utils/utilities";

export default function VotesBubble(props) {
  const [cord, setCord] = useState(props.vote.initCord);
  const [result_state, setResultState] = useState(props.resultState);
  const [dimension, setDimension] = useState(props.vote.initDimension);

  const [bgColor] = useState(() => {
    return Util_f.randomColor();
  });

  useEffect(() => {
    if (props.resultState === "summary") {
      setResultState(props.resultState);
      setCord(props.vote.centreCord);
    }
  }, [props.resultState]);

  useEffect(() => {
    setCord(props.vote.initCord);
    setDimension((_) => 0);
    const timeref = setTimeout(() => {
      setDimension((_) => props.vote.dimension);
    }, 50);

    return () => {
      clearTimeout(timeref);
    };
  }, [props.vote]);

  return (
    <>
      {cord && (
        <>
          {/* <div className="absolute" style={{ width: props.vote.initCord.cell_size, height: props.vote.initCord.cell_size, border: "1px solid red", left: cord.left, top: cord.top }}></div> */}
          <div
            style={{
              background: bgColor,
              width: dimension,
              height: dimension,
              left: cord.left + props.vote.initCord.cell_size / 2,
              top: cord.top + props.vote.initCord.cell_size / 2,
            }}
            className={`voting-ellipse ${result_state != "summary" ? "voting" : "summary"}`}
          />
        </>
      )}
    </>
  );
}
