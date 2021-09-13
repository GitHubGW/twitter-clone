import { useEffect, useState } from "react";
import { firestoreService } from "firebaseConfiguration";
import Tweet from "components/Tweet";
import TweetForm from "components/TweetForm";

const Home = ({ userObject }) => {
  console.log("Home userObject", userObject);

  const FIRESTORE_COLLECTION = "tweets";
  const [allTweets, setAllTweets] = useState("");
  const [allTweetsLength, setAllTweetsLength] = useState(0);

  useEffect(() => {
    firestoreService
      .collection(FIRESTORE_COLLECTION)
      .orderBy("createdAtTime", "desc")
      .onSnapshot((querySnapshot) => {
        const querySnapshotSize = querySnapshot.size;
        setAllTweetsLength(querySnapshotSize);

        // 전체 트윗 가져오기 (map사용)
        const queryDocumentSnapshotObjectArray = querySnapshot.docs.map((queryDocumentSnapshot) => ({
          documentId: queryDocumentSnapshot.id,
          ...queryDocumentSnapshot.data(),
        }));

        setAllTweets(queryDocumentSnapshotObjectArray);
      });
  }, []);

  return (
    <>
      <h1>Home</h1>
      <TweetForm userObject={userObject}></TweetForm>
      <h1>전체 트윗 갯수: {allTweetsLength}</h1>
      <div>
        {allTweets &&
          allTweets.map((tweetObject) => {
            return <Tweet key={tweetObject.id} tweetObject={tweetObject} isOwner={userObject.uid === tweetObject.uid ? true : false} />;
          })}
      </div>
    </>
  );
};

export default Home;
