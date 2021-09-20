import { useEffect, useState } from "react";
import { authService } from "firebaseConfiguration";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Router from "components/Router";
import GlobalStyle from "theme/GlobalStyle";
import Loading from "./Loading";
import { createNotification } from "./Notification";

const App = () => {
  // console.log("App.js authService.currentUser", authService.currentUser, "App.js userObject", userObject);
  const [initializeFirebase, setInitializeFirebase] = useState(false); // 파이어베이스 초기화 확인
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 확인
  const [userObject, setUserObject] = useState(null); // 로그인한 사용자 정보
  const [isDark, setIsDark] = useState(true); // 다크모드 확인

  // 다크모드 전환
  const changeTheme = () => {
    setIsDark(!isDark);
  };

  // 프로필 닉네임 변경시 리액트를 리랜더링 시킴
  const refreshDisplayName = () => {
    // console.log("refreshDisplayName", userObject);
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
    // authService에 AuthStateChanged 이벤트 추가
    authService.onAuthStateChanged((userObject) => {
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

  return (
    <>
      {/* 파이어베이스 초기화 후 실행 */}
      {initializeFirebase ? (
        <>
          <GlobalStyle
            bgColor={isDark === true ? true : false}
            color={isDark === true ? true : false}
            borderColor={isDark === true ? true : false}
          ></GlobalStyle>
          <Router
            isLoggedIn={true}
            userObject={userObject}
            refreshDisplayName={refreshDisplayName}
            createNotification={createNotification}
            isDark={isDark}
            changeTheme={changeTheme}
          />
          <NotificationContainer></NotificationContainer>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default App;
