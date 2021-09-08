import { useEffect, useState } from "react";
import { firestoreService } from "firebaseConfiguration";

const Home = ({ userObject }) => {
  // console.log("Home userObject", userObject);

  const FIRESTORE_COLLECTION = "tweets";
  const [tweet, setTweet] = useState("");
  const [allTweets, setAllTweets] = useState("");
  const [allTweetsLength, setAllTweetsLength] = useState(0);

  const onSubmit = async (event) => {
    event.preventDefault();

    await firestoreService.collection(FIRESTORE_COLLECTION).add({
      userUid: userObject.uid,
      userDisplayName: userObject.displayName,
      userEmail: userObject.email,
      userEmailVerified: userObject.emailVerified,
      userPhotoUrl: userObject.photoURL,
      userCreationTime: userObject.metadata.a,
      userLastSignInTime: userObject.metadata.b,
      content: tweet,
      createdAtTime: Date.now(),
      createdAtDate: new Date().toLocaleDateString(),
    });

    setTweet("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setTweet(value);
  };

  /*
  // 전체 트윗 가져오기
  const getTweets = async () => {
    const querySnapshot = await firestoreService.collection(FIRESTORE_COLLECTION).get();
    querySnapshot.forEach((queryDocumentSnapshot) => {
      const queryDocumentSnapshotObject = {
        id: queryDocumentSnapshot.id,
        ...queryDocumentSnapshot.data(),
      };

      setAllTweets((allTweets) => {
        return [queryDocumentSnapshotObject, ...allTweets];
      });
    });
  };
  */

  useEffect(() => {
    // getTweets();

    firestoreService
      .collection(FIRESTORE_COLLECTION)
      .orderBy("createdAtTime", "desc")
      .onSnapshot((querySnapshot) => {
        const querySnapshotSize = querySnapshot.size;
        setAllTweetsLength(querySnapshotSize);

        /*
      // 전체 트윗 가져오기 (forEach사용)
      querySnapshot.forEach((queryDocumentSnapshot) => {
        const queryDocumentSnapshotObject = {
          id: queryDocumentSnapshot.id,
          ...queryDocumentSnapshot.data(),
        };

        setAllTweets((allTweets) => {
          return [queryDocumentSnapshotObject, ...allTweets];
        });
      });
      */

        // 전체 트윗 가져오기 (map사용)
        const queryDocumentSnapshotObjectArray = querySnapshot.docs.map((queryDocumentSnapshot) => ({
          id: queryDocumentSnapshot.id,
          ...queryDocumentSnapshot.data(),
        }));

        setAllTweets(queryDocumentSnapshotObjectArray);
      });
  }, []);

  return (
    <>
      <h1>Home</h1>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="트윗 입력" value={tweet} onChange={onChange} maxLength={100} />
        <input type="submit" value="트윗 작성" />
      </form>
      <h1>전체 트윗 갯수: {allTweetsLength}</h1>
      <div>
        {allTweets &&
          allTweets.map((tweet) => {
            return (
              <div key={tweet.id}>
                <h3>{tweet.content}</h3>
                <h4>{tweet.createdAtDate}</h4>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Home;
