import { useEffect, useState } from "react";
import { firestoreService } from "firebaseConfiguration";
import Tweet from "components/Tweet";
import TweetForm from "components/TweetForm";

const Home = ({ userObject, changeTheme }) => {
  console.log("Home userObject", userObject);

  const [allTweets, setAllTweets] = useState("");
  const [allTweetsLength, setAllTweetsLength] = useState(0);
  const [isDesc, setIsDesc] = useState(true);
  const [searchText, setSearchText] = useState("");

  const handleOrderBy = () => {
    firestoreService
      .collection("tweets")
      .orderBy("createdAtTime", `${isDesc ? "asc" : "desc"}`)
      .onSnapshot((querySnapshot) => {
        const querySnapshotSize = querySnapshot.size;
        setAllTweetsLength(querySnapshotSize);

        const queryDocumentSnapshotObjectArray = querySnapshot.docs.map((queryDocumentSnapshot) => ({
          documentId: queryDocumentSnapshot.id,
          ...queryDocumentSnapshot.data(),
        }));
        setAllTweets(queryDocumentSnapshotObjectArray);
      });

    setIsDesc(!isDesc);
  };

  const shareTwitter = () => {
    var sendText = "노마드코더";
    var sendUrl = "https://nomadcoders.co/";
    window.open(`https://twitter.com/intent/tweet?text=${sendText}\&url\=${sendUrl}`);
  };

  const onSearchSubmit = (event) => {
    event.preventDefault();
    window.open(`https://twitter.com/search?q=${searchText}&src=typed_query`);
    setSearchText("");
  };

  const onSearchInput = (event) => {
    const {
      target: { value },
    } = event;
    setSearchText(value);
  };

  useEffect(() => {
    firestoreService
      .collection("tweets")
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
      <form onSubmit={onSearchSubmit}>
        <input type="text" placeholder="트위터 검색" onChange={onSearchInput} value={searchText}></input>
      </form>
      <button onClick={changeTheme}>모드 전환</button>
      <button onClick={handleOrderBy}>{isDesc ? "오래된순" : "최신순"}</button>
      <button onClick={shareTwitter}>트위터에 공유하기</button>
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
