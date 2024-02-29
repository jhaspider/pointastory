import { useEffect, useState } from "react";
import { setAxiosHeader } from "../data/axios_config";
import { auth } from "./use_firebase";

const useAnonymousSession = () => {
  const [firebase_user, setFirebaseUser] = useState(null);
  const [session_id, setSessionId] = useState(null);

  useEffect(() => {
    auth.signInAnonymously().catch((error) => reject(error));
    auth.onAuthStateChanged((user) => {
      if (user) setFirebaseUser(user);
    });
  }, []);

  useEffect(() => {
    if (firebase_user) {
      const fetchSessionId = async () => {
        const token = await firebase_user.getIdToken();
        setSessionId(token);
        setAxiosHeader(token);
      };

      fetchSessionId();
    }
  }, [firebase_user]);

  const logout = async () => auth.signOut();

  return { session_id, logout };
};

export default useAnonymousSession;
