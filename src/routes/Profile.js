import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { authService, firestoreService, storageService } from "firebaseConfiguration";
import userImage from "images/user.png";

const Profile = ({ userObject, refreshDisplayName }) => {
  console.log("Profile userObject", userObject);

  const history = useHistory();
  const creationTime = userObject.creationTime;
  const lastSignInTime = userObject.lastSignInTime;
  const [newDisplayName, setNewDisplayName] = useState(userObject.displayName);
  const [myTweets, setMyTweets] = useState([]);
  const [fileDataUrl, setFileDataUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const fileImageInput = useRef();

  const getTime = (time) => {
    const now = parseInt(time);
    const date = new Date(now);
    const day = ["일", "월", "화", "수", "목", "금", "토"];
    const getFullYear = date.getFullYear();
    const getMonth = date.getMonth();
    const getDate = date.getDate();
    const getDay = day[date.getDay()];
    const getHours = date.getHours();
    const getMinutes = date.getMinutes();
    return `${getFullYear}년 ${getMonth}월 ${getDate}일 ${getDay} ${getHours}시 ${getMinutes}분`;
  };

  const onClickLogOut = async () => {
    const currentUser = authService.currentUser;

    if (currentUser) {
      await authService.signOut();
      history.push("/");
    }
  };

  const getMyTweets = async () => {
    const tweets = await firestoreService.collection("tweets").where("uid", "==", userObject.uid).orderBy("createdAtTime", "desc").get();
    // Document에서 특정한 필드의 데이터만 가져오기
    // tweets.docs.map((doc)=>doc.get("content"))

    // Document에서 모든 필드의 데이터 가져오기
    // tweets.docs.map((doc)=>doc.data())

    // console.log("getMyTweets doc", doc.data());

    const myTweetsArray = tweets.docs.map((doc) => ({
      ...doc.data(),
    }));
    setMyTweets(myTweetsArray);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    let fileDownloadUrl = "";
    const currentUserObject = authService.currentUser;

    if (fileDataUrl !== "") {
      const fileReference = storageService.ref().child(`${userObject.email}/profile/${fileName}`);
      const uploadTask = await fileReference.putString(fileDataUrl, "data_url");
      fileDownloadUrl = await uploadTask.ref.getDownloadURL();
    }

    if (userObject.displayName === newDisplayName) {
      return;
    } else {
      // firebase.User = userObject
      await userObject.updateProfile({
        displayName: newDisplayName,
        photoURL: fileDownloadUrl,
      });
      refreshDisplayName();
      setNewDisplayName("");
    }

    // await firestoreService.collection("profile").add({
    //   uid: currentUserObject.uid,
    //   displayName: currentUserObject.displayName,
    //   email: currentUserObject.email,
    //   emailVerified: currentUserObject.emailVerified,
    //   photoURL: currentUserObject.photoURL,
    //   creationTime: currentUserObject.metadata.a,
    //   lastSignInTime: currentUserObject.metadata.b,
    //   content: tweet,
    //   createdAtTime: Date.now(),
    //   createdAtDate: new Date().toLocaleDateString(),
    //   fileDownloadUrl,
    // })

    fileImageInput.current.value = "";
    setFileDataUrl("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onFileChange = (event) => {
    console.log("fileImageInput", fileImageInput.current);

    const {
      target: { files },
    } = event;
    console.log("Profile Onchange", files);

    const uploadFile = files[0];
    const uploadFileName = uploadFile?.name;
    const fileReader = new FileReader();

    if (fileReader && uploadFile !== undefined && uploadFile !== null) {
      fileReader.onload = (event) => {
        const {
          target: { result },
        } = event;
        setFileDataUrl(result);
        fileImageInput.current.src = result;
      };
      fileReader.readAsDataURL(uploadFile);
    }
    setFileName(`${uploadFileName}_${Date.now()}`);
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  console.log("myTweets", myTweets);

  return (
    <>
      <h1>Profile</h1>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="유저 닉네임" onChange={onChange} value={newDisplayName}></input>
        <input type="file" accept="image/*" onChange={onFileChange}></input>
        <img
          ref={fileImageInput}
          style={{ width: "100px", height: "100px" }}
          src={userObject.photoURL ? userObject.photoURL : userImage}
          alt={userObject.email}
        ></img>
        <h4>이메일:{userObject.email}</h4>
        <h4>이메일 인증:{userObject.emailVerified === true ? "이메일 인증 완료" : "이메일 인증 X"}</h4>
        <h4>계정 생성일:{getTime(creationTime)}</h4>
        <h4>마지막 로그인:{getTime(lastSignInTime)}</h4>
        <input type="submit" value="프로필 업데이트"></input>
      </form>
      <button onClick={onClickLogOut}>로그아웃</button>
      {myTweets && myTweets.length > 0 ? (
        <div>
          {myTweets.map((myTweet) => {
            return (
              <>
                <div>
                  {myTweet.photoURL && <img src={myTweet.photoURL} alt={myTweet.displayName}></img>}
                  <h4>{myTweet.displayName}</h4>
                  <h4>#{myTweet.email}</h4>
                  <h4>{myTweet.emailVerified === true ? "이메일 인증" : "이메일 인증 X"}</h4>
                  {myTweet.fileDownloadUrl && <img src={myTweet.fileDownloadUrl} alt={myTweet.content}></img>}
                  <h5>작성한 트윗 내용:{myTweet.content}</h5>
                  <h5>트윗 작성 시간:{getTime(myTweet.createdAtTime)}</h5>
                </div>
              </>
            );
          })}
        </div>
      ) : (
        <h1>작성한 트윗이 없음</h1>
      )}
    </>
  );
};

export default Profile;
