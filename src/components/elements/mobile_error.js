import React from "react";

const MobileError = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-5">
      <img src="/icons/pointastory-v-logo.png" />
      <p className="w-2/4 text-center">This tool is optimised to work on larger screens only.</p>

      <a href="https://medium.com/@jha-amarjit/use-a-planning-poker-8f6110facb93" target="_blank" className="link my-2">
        HOW DOES IT WORK?
      </a>
    </div>
  );
};

export default MobileError;
