import { db } from "../hooks/use_firebase";

const getOnGoingRealTimeVotes = async (story_id, callback) => {
  const votesCollection = await db.collection("votes");
  const snapshot = await votesCollection.where("story_id", "==", story_id);

  var unsubscribe = snapshot.onSnapshot((querySnapshot) => {
    var vote_docs = [];
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const vote_id = change.doc.id;
        const vote_doc = {
          ...change.doc.data(),
          vote_id,
        };
        vote_docs.push(vote_doc);
      }
    });
    callback(vote_docs);
  });
  return unsubscribe;
};

export default getOnGoingRealTimeVotes;
