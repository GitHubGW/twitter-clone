import { useEffect, useState } from "react";
import { authService, firestoreService } from "firebaseConfiguration";
import { NotificationContainer, NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import Router from "components/Router";
import GlobalStyle from "theme/GlobalStyle";
import Loading from "./Loading";

const App = () => {
  // console.log("App.js authService.currentUser", authService.currentUser);
  // console.log("App.js userObject", userObject);

  const [initializeFirebase, setInitializeFirebase] = useState(false); // 파이어베이스 초기화 확인
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 확인
  const [userObject, setUserObject] = useState(null); // 로그인한 사용자 정보
  const [isDark, setIsDark] = useState(localStorage.getItem("isDark")); // 다크모드 확인
  const localDark = localStorage.getItem("isDark");

  // 다크모드 전환
  const changeTheme = async () => {
    if (isDark === "false") {
      setIsDark(true);
      localStorage.setItem("isDark", true);
      return;
    }
    setIsDark(!isDark);
    localStorage.setItem("isDark", !isDark);
  };

  // 플래시 메세지
  const createNotification = (type) => {
    switch (type) {
      case "SuccessRegister":
        NotificationManager.success("계정 생성 완료", "성공", 1200);
        break;
      case "SuccessLogin":
        NotificationManager.success("이메일 로그인 완료", "성공", 1200);
        break;
      case "SuccessGoogleLogin":
        NotificationManager.success("구글 로그인 완료", "성공", 1200);
        break;
      case "SuccessGithubLogin":
        NotificationManager.success("깃허브 로그인 완료", "성공", 1200);
        break;
      case "SuccessLogout":
        NotificationManager.success("로그아웃 완료", "성공", 1200);
        break;
      case "NotLogin":
        NotificationManager.error("로그인 후 이용 가능합니다.", "실패", 1600);
        break;
      case "SuccessPostTweet":
        NotificationManager.success("트윗 작성 완료", "성공", 1500);
        break;
      case "SuccessEditTweet":
        NotificationManager.success("트윗 수정 완료", "성공", 1500);
        break;
      case "SuccessDeleteTweet":
        NotificationManager.success("트윗 삭제 완료", "성공", 1500);
        break;
      case "SuccessProfile":
        NotificationManager.success("프로필 업데이트 완료", "성공", 1500);
        break;
      case "info":
        NotificationManager.info("트윗 작성 성공", "", 1500);
        break;
      case "warning":
        NotificationManager.warning("Warning message", "Close after 3000ms", 1500);
        break;
      case "error":
        NotificationManager.error("로그인후 이용해주세요", "오류", 1500, () => {
          alert("callback");
        });
        break;
      default:
        break;
    }
  };

  // 프로필 닉네임 변경시 리액트를 리랜더링 시킴
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
    // authService에 AuthStateChanged 이벤트 추가
    authService.onAuthStateChanged((userObject) => {
      // console.log("onAuthStateChanged User", userObject);

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
      {/* 파이어베이스 초기화 후 실행 */}
      {initializeFirebase ? (
        <>
          <GlobalStyle
            bgColor={String(localDark) === "true" ? true : false}
            color={String(localDark) === "true" ? true : false}
            borderColor={String(localDark) === "true" ? true : false}
          ></GlobalStyle>
          <Router
            isLoggedIn={true}
            userObject={userObject}
            refreshDisplayName={refreshDisplayName}
            createNotification={createNotification}
            changeTheme={changeTheme}
          />
          <NotificationContainer></NotificationContainer>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default App;
