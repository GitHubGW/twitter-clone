import { useEffect, useState } from "react";
import { authService } from "firebaseConfiguration";
import Router from "components/Router";

const App = () => {
  const [initializeFirebase, setInitializeFirebase] = useState(false); // 파이어베이스 초기화 체크
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 체크
  const [userObject, setUserObject] = useState(null); // 로그인한 사용자 체크

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      console.log("onAuthStateChanged User", user);

      if (user) {
        setIsLoggedIn(true);
        setUserObject(user);
      } else {
        setIsLoggedIn(false);
        setUserObject(null);
      }
      setInitializeFirebase(true);
    });
  }, []);

  // console.log("authService.currentUser", authService.currentUser);
  return <div>{initializeFirebase ? <Router isLoggedIn={isLoggedIn} userObject={userObject} /> : "Loading..."}</div>;
};

export default App;
