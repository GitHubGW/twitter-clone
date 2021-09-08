import { useState } from "react";
import { firebaseApp, authService } from "firebaseConfiguration";

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAccount, setIsAccount] = useState(false); // 계정 존재 여부 체크 (true: 계정있음, false: 계정없음)
  const [error, setError] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("xxx", authService.currentUser);

    try {
      const data1 = await authService.signInWithEmailAndPassword(email, password); // 로그인
      console.log("data1", data1);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "emailInput") {
      setEmail(value);
    } else if (name === "passwordInput") {
      setPassword(value);
    }
  };

  const onClickRegister = async () => {
    try {
      if (!isAccount) {
        const data2 = await authService.createUserWithEmailAndPassword(email, password); // 계정 생성
        console.log("data2", data2);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const onClickSocialLogin = async (event) => {
    const {
      target: { name },
    } = event;

    if (name === "googleLogin") {
      try {
        const googleProvider = new firebaseApp.auth.GoogleAuthProvider();
        await authService.signInWithPopup(googleProvider);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    } else if (name === "githubLogin") {
      try {
        const githubProvider = new firebaseApp.auth.GithubAuthProvider();
        await authService.signInWithPopup(githubProvider);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="emailInput" type="text" placeholder="이메일" onChange={onChange} value={email} required></input>
        <input name="passwordInput" type="password" placeholder="비밀번호" onChange={onChange} value={password} required></input>
        <input type="submit" onClick={onSubmit} value="로그인"></input>
      </form>
      <div>
        <button onClick={onClickRegister}>회원가입</button>
        <button name="googleLogin" onClick={onClickSocialLogin}>
          구글 로그인
        </button>
        <button name="githubLogin" onClick={onClickSocialLogin}>
          깃허브 로그인
        </button>
        <span>{error && error}</span>
      </div>
    </div>
  );
};

export default Authentication;
