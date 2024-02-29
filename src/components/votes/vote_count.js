import React from "react";

const VoteCount = ({ total_vote_count }) => {
  return (
    <div className="absolute top-2 right-2">
      <div className="result-counter-box bg-green-200">
        <h2>{total_vote_count}</h2>
        <p>Votes</p>
      </div>
    </div>
  );
};

export default VoteCount;
