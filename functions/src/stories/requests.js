const functions = require("firebase-functions");
const router = require("express").Router();
const { X_SESSION_KEY } = require("../utils/config");

const admin = require("firebase-admin");
const db = admin.firestore();
const auth = admin.auth();

async function validateSession(token) {
  let UID;
  try {
    const decoded = await auth.verifyIdToken(token);
    UID = decoded.uid;
    functions.logger.log(`Verified user id : ${UID}`);
  } catch (err) {
    functions.logger.error(`Invalid token passed.`);
  }

  if (!UID)
    return {
      status: false,
      reason: {
        code: "F001",
        message: "Session Expired...",
      },
    };
  else {
    return { status: true, user_id: UID };
  }
}

// POST - CREATE BOARD
router.post("/create_board", async (request, response) => {
  if (request.method !== "POST") {
    response.status(400).send("Only post request allowed for this method");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }

  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  // Create a board
  const boardCollection = db.collection("boards");
  const creationTime = new Date().getTime();
  const boardDocRef = boardCollection.doc();
  const boardObj = { user_id: isValidSession.user_id, created_at: creationTime, host: [isValidSession.user_id] };
  await boardDocRef.set(boardObj);
  const board_id = boardDocRef.id;
  functions.logger.info("1 Board Created", board_id);

  response.status(200).send({
    board_id,
  });
  return;
});

// POST - REGISTER A STORY
router.post("/registerStory", async (request, response) => {
  if (request.method !== "POST") {
    response.status(400).send("Only post request allowed for this method");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }

  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  // Validate the parameters
  const story_number = request.body["story_number"];
  if (!story_number) {
    response.status(400).send("Validation Error : Enter a valid story number.");
    return;
  }

  const board_id = request.body["board_id"];
  if (!board_id) {
    response.status(400).send("Validation Error : Board Id missing.");
    return;
  }

  const story_url = request.body["url"];
  const storiesCollection = db.collection("stories");

  // Validate duplicate story
  const duplicateStory = await storiesCollection.where("board_id", "==", board_id).where("story_number", "==", story_number).get();
  if (duplicateStory.size > 0) {
    response.status(400).send("Duplicate story.");
    return;
  }

  const creationTime = new Date().getTime();

  //Adding user to table
  const storyDocRef = storiesCollection.doc();
  const story = { user_id: isValidSession.user_id, board_id, story_number, status: 0, url: story_url, created_at: creationTime };
  await storyDocRef.set(story);
  const story_id = storyDocRef.id;
  functions.logger.info("1 Story Added", story_id);

  response.status(200).send({
    ...story,
    story_id,
  });
  return;
});

// GET - STORIES BY BOARD
router.get("/get_stories_by_board", async (request, response) => {
  if (request.method !== "GET") {
    response.status(400).send("Only get request allowed for this method");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }

  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  const board_id = request.query["board_id"];
  if (!board_id) {
    response.status(400).send("Validation Error : Board Id missing.");
    return;
  }

  const type = request.query["type"];
  let status = 0;
  if (type === "closed") status = 1;

  // Validate if board exists with session id
  const boardCollection = db.collection("boards");
  const boardDocRef = await boardCollection.doc(board_id);
  const doc = await boardDocRef.get();
  let is_owner = false;
  let owner_id = "";
  if (!doc.exists) {
    response.status(400).send("Invalid board id");
    return;
  } else {
    functions.logger.log(doc.id, "=>", doc.data());
    const board_data = doc.data();
    const host_index = board_data.host.findIndex((host_id) => host_id === isValidSession.user_id);
    if (host_index >= 0) is_owner = true;
    owner_id = board_data.user_id;
  }

  // Fetch stories
  const storiesCollection = await db.collection("stories");
  const snapshot = await storiesCollection.where("board_id", "==", board_id).where("status", "==", status).orderBy("created_at", "desc").get();
  const data = [];
  if (snapshot.empty) {
    functions.logger.log("Could not find any story");
  } else {
    snapshot.forEach((doc) => {
      const story_id = doc.id;
      const story = {
        ...doc.data(),
        story_id,
      };
      data.push(story);
    });
  }

  response.status(200).send({
    is_owner,
    owner_id,
    data,
  });
  return;
});

// POST - ADD NEW HOST TO BOARD
router.post("/add_host_to_board", async (request, response) => {
  if (request.method !== "POST") {
    response.status(400).send("Only get request allowed for this method");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }
  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  const board_id = request.body["board_id"];
  const host_id = request.body["host_id"];
  if (!board_id || !host_id) {
    response.status(400).send("Validation Error : Mandatory params missing");
    return;
  }

  const additional_host_id = isValidSession.user_id;

  // Validate if board exists with session id
  const boardCollection = db.collection("boards");
  const boardDocRef = await boardCollection.doc(board_id);
  const doc = await boardDocRef.get();
  if (!doc.exists) {
    response.status(400).send("Invalid board id");
    return;
  } else {
    const board_data = doc.data();
    boardDocRef.update({ ...board_data, host: [...board_data.host, additional_host_id] });
  }
  response.status(200).send(true);
  return;
});

// GET - ALL STORIES OF A BOARD - DEFAULT ACTIVE
router.get("/getAllStories", async (request, response) => {
  if (request.method !== "GET") {
    response.status(400).send("Only get request allowed for this method");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }

  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  const board_id = request.query["board_id"];
  if (!board_id) {
    response.status(400).send("Validation Error : Board id is missing");
    return;
  }

  const storiesCollection = await db.collection("stories");
  const snapshot = await storiesCollection.where("board_id", "==", board_id).where("status", "==", 0).orderBy("created_at", "desc").get();

  if (snapshot.empty) {
    functions.logger.log("Could not find any story");
    response.status(200).send([]);
  } else {
    const data = [];
    snapshot.forEach((doc) => {
      functions.logger.log(doc.id, "=>", doc.data());

      const story_id = doc.id;
      const story = {
        ...doc.data(),
        story_id,
      };
      data.push(story);
    });
    response.status(200).send(data);
    return;
  }

  return;
});

// GET - STORY DETAIL BY ID
router.get("/getStoryById", async (request, response) => {
  if (request.method !== "GET") {
    response.status(400).send("Only get request allowed for this method");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }

  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  // Validate the parameters
  const story_id = request.query["story_id"];
  if (!story_id) {
    response.status(400).send("Validation Error : Story id missing");
    return;
  }

  const storyDocRef = await db.collection("stories").doc(story_id);
  const doc = await storyDocRef.get();
  if (!doc.exists) {
    response.status(400).send("Invalid story Id");
    return;
  } else {
    response.status(200).send({ story_id: doc.id, ...doc.data() });
  }
  return;
});

// POST  - CASE VOTE
router.post("/castVote", async (request, response) => {
  if (request.method !== "POST") {
    response.status(400).send("Only post request allowed for this method");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }
  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  // Validate the parameters
  const story_id = request.body["story_id"];
  if (!story_id) {
    response.status(400).send("Validation Error : Story id missing");
    return;
  }

  const story_point = request.body["story_point"];
  if (!story_point) {
    response.status(400).send("Validation Error : Story points missing");
    return;
  }

  const player = request.body["player"];

  //Adding user to table
  const votesCollection = db.collection("votes");
  const docRef = await votesCollection.where("story_id", "==", story_id).where("user_id", "==", isValidSession.user_id).get();
  let votesDocRef = votesCollection.doc();

  // If vote exists for this user
  let isNewVote = true;
  if (!docRef.empty) {
    isNewVote = false;
    votesDocRef = votesCollection.doc(docRef.docs[0].id);
    functions.logger.info("Document Found ::", docRef.docs[0].id);
  }

  const created_at = new Date().getTime();

  const vote = { user_id: isValidSession.user_id, story_id, story_point, player, created_at };
  await votesDocRef.set(vote);
  const voteGenId = votesDocRef.id;
  functions.logger.info("1 Vote Casted", voteGenId);

  // Updating stories to indicate vote in progress
  const storyDoc = await db.collection("stories").doc(story_id);
  const resetData = { revote: false };
  storyDoc.update(resetData);

  // Update vote count, if unique vote
  if (isNewVote) {
    // const storyDoc = await db.collection("stories").doc(story_id);
    storyDoc
      .get()
      .then((doc) => {
        if (doc.exists) {
          const storyData = doc.data();
          storyDoc.update({ vote_count: (parseInt(storyData.vote_count) || 0) + 1 });
        }
        return;
      })
      .catch((error) => {});
  }

  response.status(200).send({
    ...vote,
    voteGenId,
  });

  return;
});

// POST - END VOTE
router.post("/endVote", async (request, response) => {
  if (request.method !== "POST") {
    response.status(400).send("Only post request allowed for this method");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }
  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  // Validate the parameters
  const story_id = request.body["story_id"];
  if (!story_id) {
    response.status(400).send("Validation Error : Story id missing");
    return;
  }

  // Update user status as validated
  const storyDoc = await db.collection("stories").doc(story_id);
  storyDoc.update({ status: 1 });

  // Returned sorted stories
  const votesCollection = await db.collection("votes");
  const snapshot = await votesCollection.where("story_id", "==", story_id).orderBy("story_point", "asc").get();

  if (snapshot.empty) {
    //No votes yet
    functions.logger.info("No votes casted yet");
    response.status(200).send([]);
  } else {
    const data = [];
    snapshot.forEach((doc) => {
      functions.logger.log(doc.id, "=>", doc.data());

      const vote_id = doc.id;
      const vote = {
        ...doc.data(),
        vote_id,
      };
      data.push(vote);
    });
    response.status(200).send(data);
    return;
  }

  return;
});

// POST - RE-VOTE
router.post("/reVote", async (request, response) => {
  if (request.method !== "POST") {
    response.status(400).send("Only post request allowed for this method");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }
  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  // Validate the parameters
  const story_id = request.body["story_id"];
  if (!story_id) {
    response.status(400).send("Validation Error : Story id missing");
    return;
  }

  // Update user status as validated
  const storyDoc = await db.collection("stories").doc(story_id);
  const resetData = { status: 0, revote: true };
  storyDoc.update(resetData);

  // Flush all the previous votes
  const votes = await db.collection("votes").where("story_id", "==", story_id).get();
  const batch = db.batch();
  votes.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  // Returned sorted stories
  response.status(200).send(resetData);
  return;
});

// GET - RESULT BY STORY ID
router.get("/getResultsByStoryId", async (request, response) => {
  if (request.method !== "GET") {
    response.status(400).send("Only get request allowed for this method");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }
  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  // Validate the parameters
  const story_id = request.query["story_id"];
  if (!story_id) {
    response.status(400).send("Validation Error : Story id is missing");
    return;
  }

  //Adding user to table
  const votesCollection = await db.collection("votes");
  const snapshot = await votesCollection.where("story_id", "==", story_id).orderBy("story_point", "asc").get();

  if (snapshot.empty) {
    //No votes yet
    functions.logger.info("No votes casted yet");
    response.status(200).send([]);
  } else {
    const data = [];
    snapshot.forEach((doc) => {
      const vote_id = doc.id;
      const vote = {
        ...doc.data(),
        vote_id,
      };
      data.push(vote);
    });
    response.status(200).send(data);
    return;
  }
});

// DELETE - A STORY
router.delete("/delete_story", async (request, response) => {
  if (request.method !== "DELETE") {
    response.status(400).send("Inaccurate method call.");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }
  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  // Validate the parameters
  const story_id = request.body["story_id"];
  if (!story_id) {
    response.status(400).send("Validation Error : Story id missing");
    return;
  }

  const documentRef = await db.collection("stories").doc(story_id);
  const docRef = await documentRef.get();
  if (docRef.exists) {
    await documentRef.delete();
    functions.logger.log(`Story Deleted : ${story_id}`);
    response.status(204).send();
  } else {
    functions.logger.log("Could not delete");
    response.status(404).send("Could not find the document to delete.");
  }
  return;
});

// GET - ALL CLOSED STORIES COUNT
router.get("/get_closed_stories_count", async (request, response) => {
  if (request.method !== "GET") {
    response.status(400).send("Only get request allowed for this method");
    return;
  }

  const sessionKey = request.headers[X_SESSION_KEY];
  if (!sessionKey) {
    response.status(400).send("Validation Error : Session Key is Missing");
    return;
  }
  const isValidSession = await validateSession(sessionKey);
  if (!isValidSession.status) {
    response.status(500).send(isValidSession.reason);
    return;
  }

  //Adding user to table
  const storiesCollection = await db.collection("stories");
  const snapshot = await storiesCollection.where("status", "==", 1).get();

  if (snapshot.empty) {
    //No votes yet
    functions.logger.info("No stories created yet");
    response.status(200).send([]);
  } else {
    const count = snapshot.size;
    functions.logger.info(`Stories count : ${count}`);
    response.status(200).send({ count });
    return;
  }
});

module.exports = router;
