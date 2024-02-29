import React from "react";

const InternetError = () => (
  <div className="flex flex-col h-full items-center justify-center">
    <div>
      <h2>No Internet</h2>
      <p>Try :</p>
      <ul>
        <li>Checking the network cables, modem and router</li>
        <li>Reconnecting to Wi-Fi</li>
      </ul>
      <p className="text-gray-400 text-sm mt-4">ERR_INTERNET_DISCONNECTED</p>
    </div>
  </div>
);

export default InternetError;
