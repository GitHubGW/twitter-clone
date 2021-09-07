import { authService } from "firebaseConfiguration";
import { useState } from "react";

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAccount, setIsAccount] = useState(false); // 계정 존재 여부 체크 (true: 계정있음, false: 계정없음)
  const [error, setError] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      if (isAccount) {
        const data1 = await authService.signInWithEmailAndPassword(email, password); // 로그인
        console.log("data1", data1);
      } else {
        const data2 = await authService.createUserWithEmailAndPassword(email, password); // 계정 생성
        console.log("data2", data2);
      }
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

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="emailInput" type="text" placeholder="이메일" value={email} onChange={onChange} required></input>
        <input name="passwordInput" type="password" placeholder="비밀번호" value={password} onChange={onChange} required></input>
        <input type="submit" value={isAccount ? "로그인" : "계정 생성"}></input>
      </form>
      <div>
        <button>회원가입</button>
        <button>구글 로그인</button>
        <button>깃허브 로그인</button>
      </div>
    </div>
  );
};

export default Authentication;
