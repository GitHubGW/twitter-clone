import { useState } from "react";
import Router from "components/Router";
import { authService } from "firebaseConfiguration";

const App = () => {
  console.log("authService.currentUser", authService.currentUser);

  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

  return (
    <div>
      <Router isLoggedIn={isLoggedIn}></Router>
    </div>
  );
};

export default App;
