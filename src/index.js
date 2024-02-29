import React from "react";
import ReactDOM from "react-dom";
import "./style.css";
import InternetError from "./components/elements/internet_error";
import MobileError from "./components/elements/mobile_error";
import settings from "./settings.json";
import Router from "./router";

const InitApp = (props) => {
  const { error } = props;

  if (error) return <InternetError />;
  return (
    <>
      <div className="hidden md:block">
        <Router />
      </div>
      <div className="block md:hidden">
        <MobileError />
      </div>
    </>
  );
};

function loadScript(src, callback) {
  let script = document.createElement("script");
  script.src = src;
  script.onload = (e) => callback(true);
  script.onerror = () => callback(null, new Error(""));
  script.onabort = () => callback(null, new InternetError(""));
  document.head.append(script);
}

loadScript(`https://www.google.com/recaptcha/api.js?render=${settings.captchaSiteKey}`, (result, error) => {
  ReactDOM.render(<InitApp error={error} />, document.getElementById("root"));
});
