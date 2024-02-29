import React, { useContext } from "react";
import useAnonymousSession from "../hooks/use_anonymous_session";
import { flushAllSessions } from "../utils/session_storage";
import { useRouterContext } from "./router_provider";

const UserContext = React.createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

const UserProvider = ({ children }) => {
  const { session_id, logout } = useAnonymousSession();
  const { showToast } = useRouterContext();

  const signOutTheUser = () => {
    flushAllSessions();
    logout();
    location.reload();
  };

  return (
    <UserContext.Provider
      value={{
        logout: () => signOutTheUser(),
        session_id,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
