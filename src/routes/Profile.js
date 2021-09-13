import { useHistory } from "react-router-dom";
import { authService, firestoreService } from "firebaseConfiguration";
import { useEffect, useState } from "react";

const Profile = ({ userObject, refreshDisplayName }) => {
  console.log("Profile userObject", userObject);

  const FIRESTORE_COLLECTION = "tweets";
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObject.displayName);

  const onClickLogOut = async () => {
    const currentUser = authService.currentUser;

    if (currentUser) {
      await authService.signOut();
      history.push("/");
    }
  };

  const getMyTweets = async () => {
    const tweets = await firestoreService.collection(FIRESTORE_COLLECTION).where("uid", "==", userObject.uid).orderBy("createdAtTime", "desc").get();
    // Document에서 특정한 필드의 데이터만 가져오기
    // tweets.docs.map((doc)=>doc.get("content"))

    // Document에서 모든 필드의 데이터 가져오기
    // tweets.docs.map((doc)=>doc.data())

    tweets.docs.map((doc) => console.log("getMyTweets doc", doc.data()));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (userObject.displayName === newDisplayName) {
      return;
    } else {
      // firebase.User = userObject
      await userObject.updateProfile({
        displayName: newDisplayName,
      });
      refreshDisplayName();
      setNewDisplayName("");
    }
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="유저 닉네임" onChange={onChange} value={newDisplayName}></input>
        <input type="submit" value="프로필 업데이트"></input>
      </form>
      <button onClick={onClickLogOut}>로그아웃</button>
    </>
  );
};

export default Profile;
