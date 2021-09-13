import { useEffect, useState } from "react";
import { authService } from "firebaseConfiguration";
import Router from "components/Router";

const App = () => {
  const [initializeFirebase, setInitializeFirebase] = useState(false); // 파이어베이스 초기화 체크
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 체크
  const [userObject, setUserObject] = useState(null); // 로그인한 사용자 체크
  console.log("44", authService.currentUser);
  console.log("55", userObject);

  // 프로필 이름 변경시 리액트를 리랜더링 시켜주는 함수
  const refreshDisplayName = () => {
    console.log("4a", userObject);
    const currentUserObject = authService.currentUser;

    setUserObject({
      uid: currentUserObject.uid,
      displayName: currentUserObject.displayName,
      email: currentUserObject.email,
      emailVerified: currentUserObject.emailVerified,
      photoURL: currentUserObject.photoURL,
      creationTime: currentUserObject.metadata.a,
      lastSignInTime: currentUserObject.metadata.b,
      updateProfile: (displayName) => currentUserObject.updateProfile(displayName),
    });
  };

  useEffect(() => {
    authService.onAuthStateChanged((userObject) => {
      console.log("onAuthStateChanged User", userObject);

      if (userObject) {
        if (userObject.displayName === null) {
          userObject.updateProfile({
            displayName: "유저",
          });
        }
        setIsLoggedIn(true);
        setUserObject({
          uid: userObject.uid,
          displayName: userObject.displayName,
          email: userObject.email,
          emailVerified: userObject.emailVerified,
          photoURL: userObject.photoURL,
          creationTime: userObject.metadata.a,
          lastSignInTime: userObject.metadata.b,
          updateProfile: (displayName) => userObject.updateProfile(displayName),
        });
      } else {
        setIsLoggedIn(false);
        setUserObject(null);
      }
      setInitializeFirebase(true);
    });
  }, []);

  return <div>{initializeFirebase ? <Router isLoggedIn={isLoggedIn} userObject={userObject} refreshDisplayName={refreshDisplayName} /> : "Loading..."}</div>;
};

export default App;
