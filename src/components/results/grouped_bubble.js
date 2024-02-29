import React, { useEffect, useMemo, useState } from "react";
import useEvent from "../../hooks/use_event";
import { Util_f } from "../../utils/utilities";

export default function GroupedBubble(props) {
  // STATES
  const [anim_val, setAnimVal] = useState(null);
  const [bgColor, setBgColor] = useState(null);
  const [stackIndex, setStackIndex] = useState(props.vote.zIndex);

  // EFFECTS
  useEffect(() => {
    setAnimVal({ cord: { ...props.vote.initial }, dimension: props.index == 0 ? 100 : 0, expanded: false });
    setBgColor(Util_f.randomColor());
    const timeref = setTimeout(
      () => {
        setAnimVal((_) => ({
          cord: { ...props.vote.final },
          dimension: props.vote.dimension,
        }));
      },
      props.index == 0 ? 50 : 100
    );

    return () => {
      clearTimeout(timeref);
    };
  }, [props.vote]);

  // METHODS
  const onMouseEnterHandler = (e) => {
    if (props.vote.count <= 0) return;
    setStackIndex(100);
  };

  const onMouseLeaveHandler = (e) => {
    if (props.vote.count <= 0 || anim_val.expanded) return;
    setStackIndex(props.vote.zIndex);
  };

  const viewVoters = () => {
    if (props.vote.count <= 0) return;
    setAnimVal((prevVal) => {
      if (prevVal.expanded) {
        return {
          ...prevVal,
          cord: { ...props.vote.final },
          dimension: props.vote.dimension,
          expanded: false,
        };
      } else {
        return {
          ...prevVal,
          cord: { ...props.vote.initial },
          dimension: 600,
          expanded: true,
        };
      }
    });
  };

  return (
    <>
      {anim_val && anim_val.cord && (
        <>
          <div
            className={`flip-card ${props.index == 0 ? "pop" : "result_summary"} ${props.vote.count > 0 ? "cursor-pointer" : ""}`}
            style={{
              left: anim_val.cord.left - anim_val.dimension / 2,
              top: anim_val.cord.top - anim_val.dimension / 2,
              width: anim_val.dimension,
              height: anim_val.dimension,
              opacity: props.vote.count > 0 ? 1 : 0.2,
              zIndex: stackIndex,
            }}
            onMouseEnter={onMouseEnterHandler}
            onMouseLeave={onMouseLeaveHandler}
            onClick={viewVoters}>
            <div className={`flip-card-inner ${anim_val.expanded ? "flip" : ""}`}>
              <div
                style={{
                  backgroundColor: props.vote.count > 0 ? bgColor : "#cdcdcd",
                }}
                className="voting-ellipse flip-card-front">
                <h2>{props.vote.story_point}</h2>
                <p>{`${props.vote.count} Vote${props.vote.count > 1 ? "s" : ""}`}</p>
              </div>
              <div
                style={{
                  backgroundColor: props.vote.count > 0 ? bgColor : "#cdcdcd",
                }}
                className="voting-ellipse flip-card-back w-full h-full">
                <h1 className="absolute large-text opacity-5 text-right w-full pr-20">{props.vote.story_point}</h1>
                <div className="self-center w-full pl-20">
                  {props.vote.voters.map((voter) => {
                    return <h3 key={`voter-${voter.user_id}`} className="voter-list">{`${voter.player ? voter.player : " -- "}`}</h3>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
