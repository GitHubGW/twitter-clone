import { useEffect, useRef, useState } from "react";
import { firestoreService, storageService } from "firebaseConfiguration";
import { v4 as uuidv4 } from "uuid";
import Tweet from "components/Tweet";

const Home = ({ userObject }) => {
  console.log("Home userObject", userObject);

  const FIRESTORE_COLLECTION = "tweets";
  const [tweet, setTweet] = useState("");
  const [allTweets, setAllTweets] = useState("");
  const [allTweetsLength, setAllTweetsLength] = useState(0);
  const [fileDataUrl, setFileDataUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const fileImageInput = useRef();
  const textInput = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();

    let fileDownloadUrl = "";

    if (fileDataUrl) {
      // 1. 파일이 업로드되서 저장될 버킷 내부의 래퍼런스 경로를 생성
      const fileReference = storageService.ref().child(`${userObject.email}/${fileName}`);

      // 2. 파일 데이터를 버킷 내부의 래퍼런스 경로로 전달 (파일을 버킷에 업로드)
      const uploadTask = await fileReference.putString(fileDataUrl, "data_url");

      // 3. 버킷 내부의 래퍼런스에 있는 파일에 대한 DownloadURL을 받음
      fileDownloadUrl = await uploadTask.ref.getDownloadURL();
    }

    await firestoreService.collection(FIRESTORE_COLLECTION).add({
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
      fileDownloadUrl,
    });

    fileImageInput.current.value = "";
    setFileDataUrl("");
    setTweet("");
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
    const uploadFileName = uploadFile.name;
    setFileName(`${uploadFileName}_${Date.now()}`);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(uploadFile);
    fileReader.onload = (event) => {
      const {
        target: { result },
      } = event;
      setFileDataUrl(result);
    };
  };

  const onCancelClick = () => {
    setFileDataUrl("");
    setTweet("");
    fileImageInput.current.value = "";
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
        <input type="file" accept="image/*" onChange={onFileChange} ref={fileImageInput} />
        <input type="text" placeholder="트윗 입력" value={tweet} onChange={onChange} maxLength={100} ref={textInput} />
        {fileDataUrl && (
          <div>
            <img src={fileDataUrl} alt="file" style={{ width: "300px", height: "250px" }} />
            <button onClick={onCancelClick}>취소</button>
          </div>
        )}
        <input type="submit" value="트윗 작성" onClick={onSubmit} />
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
