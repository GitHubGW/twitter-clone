import { useEffect, useRef, useState } from "react";
import { firestoreService, storageService } from "firebaseConfiguration";
import Tweet from "components/Tweet";

const Home = ({ userObject }) => {
  console.log("Home userObject", userObject.uid);

  const FIRESTORE_COLLECTION = "tweets";
  const [tweet, setTweet] = useState("");
  const [allTweets, setAllTweets] = useState("");
  const [allTweetsLength, setAllTweetsLength] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileDataUrl, setFileDataUrl] = useState("");
  const fileInput = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();

    storageService.ref().


    /* await firestoreService.collection(FIRESTORE_COLLECTION).add({
      uid: userObject.uid,
      displayName: userObject.displayName,
      email: userObject.email,
      emailVerified: userObject.emailVerified,
      photoUrl: userObject.photoURL,
      creationTime: userObject.metadata.a,
      lastSignInTime: userObject.metadata.b,
      content: tweet,
      createdAtTime: Date.now(),
      createdAtDate: new Date().toLocaleDateString(),
    });

    setTweet(""); */
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setTweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const uploadFile = files[0];
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      const {
        target: { result },
      } = event;
      setFileDataUrl(result);
    };
    fileReader.readAsDataURL(uploadFile);
  };

  const onCancelClick = () => {
    setFileDataUrl("");
    fileInput.current.value = "";
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
          documentId: queryDocumentSnapshot.id,
          ...queryDocumentSnapshot.data(),
        }));

        setAllTweets(queryDocumentSnapshotObjectArray);
      });
  }, []);

  return (
    <>
      <h1>Home</h1>
      <form onSubmit={onSubmit}>
        <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
        <input type="text" placeholder="트윗 입력" value={tweet} onChange={onChange} maxLength={100} />
        {fileDataUrl && (
          <div>
            <img src={fileDataUrl} alt="file" style={{ width: "300px", height: "250px" }} />
            <button onClick={onCancelClick}>취소</button>
          </div>
        )}
        <input type="submit" value="트윗 작성" />
      </form>
      <h1>전체 트윗 갯수: {allTweetsLength}</h1>
      <div>
        {allTweets &&
          allTweets.map((tweetObject) => {
            console.log("tweetObject", tweetObject);
            return <Tweet key={tweetObject.id} tweetObject={tweetObject} isOwner={userObject.uid === tweetObject.uid ? true : false} />;
          })}
      </div>
    </>
  );
};

export default Home;
