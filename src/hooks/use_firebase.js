import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import settings from "../settings.json";

if (!firebase.apps.length) firebase.initializeApp(settings.firebase);
const db = firebase.firestore();
const auth = firebase.auth();
if (process.env.NODE_ENV !== "production" && window.location.hostname === "localhost") {
  db.settings({ host: "0.0.0.0:3900", ssl: false }); // Useful for listening to database updates while running in emulators
  auth.useEmulator("http://localhost:9099/"); // Useful for Token validation while running in the emulator
}

export { firebase, db, auth };
