import { useEffect, useState } from "react";
import { authService, firestoreService } from "firebaseConfiguration";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Router from "components/Router";
import GlobalStyle from "theme/GlobalStyle";

const App = () => {
  console.log("authService.currentUser", authService.currentUser);
  // console.log("userObject", userObject);

  const [initializeFirebase, setInitializeFirebase] = useState(false); // 파이어베이스 초기화 체크
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 체크
  const [userObject, setUserObject] = useState(null); // 로그인한 사용자 체크
  const [isDark, setIsDark] = useState(localStorage.getItem("isDark")); // 다크모드 체크
  const localDark = localStorage.getItem("isDark");

  const changeTheme = async () => {
    if (isDark === "false") {
      setIsDark(true);
      localStorage.setItem("isDark", true);
      return;
    }
    setIsDark(!isDark);
    localStorage.setItem("isDark", !isDark);
  };

  const createNotification = (type) => {
    switch (type) {
      case "info":
        NotificationManager.info("트윗 작성 성공", "", 1500);
        break;
      case "postTweetSuccess":
        NotificationManager.success("트윗 작성 완료", "성공", 1500);
        break;
      case "editTweetSuccess":
        NotificationManager.success("트윗 수정 완료", "성공", 1500);
        break;
      case "deleteTweetSuccess":
        NotificationManager.success("트윗 삭제 완료", "성공", 1500);
        break;
      case "profileSuccess":
        NotificationManager.success("프로필 업데이트 완료", "성공", 1500);
        break;
      case "warning":
        NotificationManager.warning("Warning message", "Close after 3000ms", 1500);
        break;
      case "error":
        NotificationManager.error("Error message", "Click me!", 1500, () => {
          alert("callback");
        });
        break;
      default:
        break;
    }
  };

  // 프로필 이름 변경시 리액트를 리랜더링 시켜주는 함수
  const refreshDisplayName = () => {
    console.log("refreshDisplayName", userObject);
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

  return (
    <div>
      {initializeFirebase ? (
        <>
          <GlobalStyle
            bgColor={String(localDark) === "true" ? true : false}
            color={String(localDark) === "true" ? true : false}
            borderColor={String(localDark) === "true" ? true : false}
          ></GlobalStyle>
          <Router
            isLoggedIn={isLoggedIn}
            userObject={userObject}
            refreshDisplayName={refreshDisplayName}
            createNotification={createNotification}
            changeTheme={changeTheme}
          />
          <NotificationContainer></NotificationContainer>
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default App;
