const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const session = require("./src/session/session");
const stories = require("./src/stories/stories");

const settings = require("./src/settings.json");

exports.session = functions.region(settings.region).https.onRequest(session);
exports.stories = functions.region(settings.region).https.onRequest(stories);
