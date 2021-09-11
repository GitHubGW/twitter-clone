import { useHistory } from "react-router-dom";
import { authService, firestoreService } from "firebaseConfiguration";
import { useEffect } from "react";

const Profile = ({ userObject }) => {
  console.log("Profile userObject", userObject);

  const FIRESTORE_COLLECTION = "tweets";

  const history = useHistory();

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

  useEffect(() => {
    getMyTweets();
  }, []);

  return (
    <>
      <h1>Profile</h1>
      <button onClick={onClickLogOut}>로그아웃</button>
    </>
  );
};

export default Profile;
