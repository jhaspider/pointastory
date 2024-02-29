import React from "react";
import Logo from "../../components/elements/logo";

const HeaderFooterLayout = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-screen">
      <div className="h-12 bg-white flex flex-row justify-start items-center px-8 bg-gray-50">
        <Logo />
      </div>
      <div className="w-full grow flex flex-col ">{children}</div>
      <div className="w-full h-12 border-t py-2 flex items-center justify-center">
        <p className="text-center small-text">Version : 1.0.0</p>
      </div>
    </div>
  );
};

export default HeaderFooterLayout;
