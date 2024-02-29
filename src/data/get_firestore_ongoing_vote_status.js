import { db, firebase } from "../hooks/use_firebase";

const getOnGoingVoteStatus = async (story_id, callback) => {
  const storiesCollection = await db.collection("stories");
  const snapshot = await storiesCollection.where(firebase.firestore.FieldPath.documentId(), "==", story_id);
  var unsubscribe = snapshot.onSnapshot((querySnapshot) => {
    var story = null;
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "modified") {
        story = {
          ...change.doc.data(),
          story_id: change.doc.id,
        };
      }
    });
    callback(story);
  });

  return unsubscribe;
};

export default getOnGoingVoteStatus;
