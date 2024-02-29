import React, { useState } from "react";

function generateFebo() {
  let febo = [];
  let nextNumber = 0;
  for (let i = 0; i < 9; i++) {
    if (febo.length >= 1) {
      let secondNumber = febo[febo.length - 2] ? febo[febo.length - 2] : 1;
      nextNumber = secondNumber + febo[febo.length - 1];
    } else {
      nextNumber = 1;
    }
    febo.push(nextNumber);
  }
  return febo;
}

export function useFebo() {
  const [febonacci] = useState(() => {
    return generateFebo();
  });

  return febonacci;
}
