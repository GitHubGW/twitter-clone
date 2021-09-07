import { useEffect, useState } from "react";
import { authService } from "firebaseConfiguration";
import Router from "components/Router";

const App = () => {
  const [initializeFirebase, setInitializeFirebase] = useState(false); // 파이어베이스 초기화 체크
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      console.log("onAuthStateChanged User", user);

      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInitializeFirebase(true);
    });
  }, []);

  // console.log("authService.currentUser", authService.currentUser);
  return <div>{initializeFirebase ? <Router isLoggedIn={isLoggedIn}></Router> : "Loading..."}</div>;
};

export default App;
