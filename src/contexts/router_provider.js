import React, { useContext, useEffect, useState } from "react";

import Toast from "../components/elements/toast";
import Spinner from "../components/elements/spinner";
import settings from "../settings.json";
import { verifyToken } from "../data";

const RouterContext = React.createContext();

export const useRouterContext = () => {
  return useContext(RouterContext);
};

export const RouterProvider = ({ children }) => {
  const [msg, setMsg] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [severity, setSeverity] = useState();
  const [storyRefreshed, setStoryRefreshed] = useState(null);
  const [is_recaptch_verified, setReCaptchaVerified] = useState(null);

  useEffect(() => {
    grecaptcha.ready(() => {
      grecaptcha.execute(settings.captchaSiteKey, { action: "login" }).then((token) => {
        let tokenPromise = verifyToken(token);
        tokenPromise
          .then(async (result) => {
            if (result.success == true && result.score >= 0.5) {
              setReCaptchaVerified(true);
            } else {
              throw new Error("Score validation failed.");
            }
          })
          .catch((err) => {
            setReCaptchaVerified(false);
          });
      });
    });
  }, []);

  const showToastHandler = (msg, severity) => {
    setMsg(msg);
    setSeverity(severity || "info");
  };

  const updateStory = (story) => {
    setStoryRefreshed(story);
  };

  if (is_recaptch_verified === false) return <p className="text-center">System has detected spurious use</p>;

  if (is_recaptch_verified === true)
    return (
      <RouterContext.Provider
        value={{
          showToast: showToastHandler,
          storyRefreshed,
          refreshStories: (story) => updateStory(story),
          showSpinner: () => setSpinner(true),
          hideSpinner: () => setSpinner(false),
        }}>
        <>
          {children}
          {msg && <Toast msg={msg} severity={severity} onClose={() => setMsg("")} />}
          {spinner && <Spinner />}
        </>
      </RouterContext.Provider>
    );

  return null;
};
