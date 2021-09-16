import { useState } from "react";
import { firebaseApp, authService } from "firebaseConfiguration";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import googleLogo from "../images/google-logo.svg";

const LoginFormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  height: 600px;
  z-index: 10;
  background-color: white;
  border-radius: 20px;
  border: 3px solid gray;
`;

const LoginFormContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
  padding-top: 45px;
`;

const IconTwitter = styled(FontAwesomeIcon)`
  font-size: 40px;
  color: var(--twitter-color);
  cursor: pointer;
`;

const LoginFormTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-top: 30px;
  margin-bottom: 10px;
`;

const LoginFormTag = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
`;

const LoginInputTag = styled.input`
  border: none;
  outline: none;
  padding: 15px;
  padding-bottom: 15px;
  padding-top: 27px;
  background-color: #f5f5f5;
  margin-top: 10px;
  font-size: 16px;
  border-radius: 5px;

  &:focus {
    background-color: #e8e8e8;
  }

  &::placeholder {
    font-size: 14px;
    position: absolute;
    top: 10px;
    left: 15px;
  }
`;

const LoginSubmitTag = styled.input`
  border: none;
  outline: none;
  background-color: #98cff8;
  padding: 12px;
  color: white;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: var(--twitter-color);
  }
`;

const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
`;

const RegisterButton = styled.button`
  color: var(--twitter-color);
  margin-top: 16px;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const CloseButton = styled(FontAwesomeIcon)`
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 28px;
  cursor: pointer;
  color: #303030;
`;

const GoogleLogin = styled.button`
  border: none;
  outline: none;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 9px;
  color: black;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const GithubLogin = styled.button`
  border: none;
  outline: none;
  background-color: #303030;
  padding: 9px;
  color: white;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #0d1118;
  }
`;

const IconGithub = styled(FontAwesomeIcon)`
  font-size: 25px;
`;

const IconGoogle = styled.img`
  width: 22px;
`;

const IconGoogleTitle = styled.span`
  margin-top: 3px;
  margin-left: 8px;
`;

const IconGithubTitle = styled.span`
  margin-top: 3px;
  margin-left: 8px;
`;

const ErrorMessage = styled.h3`
  height: 20px;
  font-size: 13px;
  margin-top: 8px;
  color: #eb4d4b;
  font-weight: bold;
`;

const MenuLoginForm = styled.div``;

const MenuLoginButton = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 15px;
  color: white;
  border-radius: 30px;
  font-size: 15px;
  font-weight: bold;
  background-color: #98cff8;
`;

const MenuLogoutButton = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 15px;
  color: white;
  border-radius: 30px;
  font-size: 15px;
  font-weight: bold;
  background-color: #98cff8;
`;

const Authentication = (userObject) => {
  console.log("Authentication userObject", userObject);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAccount, setIsAccount] = useState(false); // 계정 존재 여부 체크 (true: 계정있음, false: 계정없음)
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(false);

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

  const handleMainLogin = (event) => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <>
      <MenuLoginForm>
        <MenuLoginButton onClick={handleMainLogin}>로그인</MenuLoginButton>
        <MenuLoginButton onClick={handleMainLogin}>회원가입</MenuLoginButton>
        <MenuLogoutButton>로그아웃</MenuLogoutButton>
      </MenuLoginForm>
      {isLoginForm ? (
        <>
          <LoginFormContainer>
            <LoginFormContent>
              <IconTwitter icon={faTwitter}></IconTwitter>
              <LoginFormTitle>트위터 로그인</LoginFormTitle>
              <LoginFormTag onSubmit={onSubmit}>
                <LoginInputTag name="emailInput" type="text" placeholder="이메일" onChange={onChange} value={email} required></LoginInputTag>
                <LoginInputTag name="passwordInput" type="password" placeholder="비밀번호" onChange={onChange} value={password} required></LoginInputTag>
                <ErrorMessage>{error && error}</ErrorMessage>
                <LoginSubmitTag type="submit" onClick={onSubmit} value="로그인"></LoginSubmitTag>
              </LoginFormTag>
              <SocialLoginContainer>
                <GoogleLogin name="googleLogin" onClick={onClickSocialLogin}>
                  <IconGoogle src={googleLogo}></IconGoogle>
                  <IconGoogleTitle>구글 로그인</IconGoogleTitle>
                </GoogleLogin>
                <GithubLogin name="githubLogin" onClick={onClickSocialLogin}>
                  <IconGithub icon={faGithub}></IconGithub>
                  <IconGithubTitle>깃허브 로그인</IconGithubTitle>
                </GithubLogin>
                <RegisterButton onClick={onClickRegister}>트위터 가입</RegisterButton>
                <CloseButton icon={faTimesCircle} onClick={handleMainLogin}></CloseButton>
              </SocialLoginContainer>
            </LoginFormContent>
          </LoginFormContainer>
        </>
      ) : null}
    </>
  );
};

export default Authentication;

// <LoginFormContent>
// <IconTwitter icon={faTwitter}></IconTwitter>
// <LoginFormTitle>트위터 로그인</LoginFormTitle>
// <LoginFormTag onSubmit={onSubmit}>
//   <LoginInputTag name="emailInput" type="text" placeholder="이메일" onChange={onChange} value={email} required></LoginInputTag>
//   <LoginInputTag name="passwordInput" type="password" placeholder="비밀번호" onChange={onChange} value={password} required></LoginInputTag>
//   <ErrorMessage>{error && error}</ErrorMessage>
//   <LoginSubmitTag type="submit" onClick={onSubmit} value="로그인"></LoginSubmitTag>
// </LoginFormTag>
// <SocialLoginContainer>
//   <GoogleLogin name="googleLogin" onClick={onClickSocialLogin}>
//     <IconGoogle src={googleLogo}></IconGoogle>
//     <IconGoogleTitle>구글 로그인</IconGoogleTitle>
//   </GoogleLogin>
//   <GithubLogin name="githubLogin" onClick={onClickSocialLogin}>
//     <IconGithub icon={faGithub}></IconGithub>
//     <IconGithubTitle>깃허브 로그인</IconGithubTitle>
//   </GithubLogin>
//   <RegisterButton onClick={onClickRegister}>트위터 가입</RegisterButton>
//   <CloseButton icon={faTimesCircle} onClick={handleLogin}></CloseButton>
// </SocialLoginContainer>
// </LoginFormContent>
