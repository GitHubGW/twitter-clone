import { useState } from "react";
import { firebaseApp, authService } from "firebaseConfiguration";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import googleLogo from "../images/google-logo.svg";
import { useHistory } from "react-router-dom";

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
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;

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
  padding: 10px;
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
  padding: 12px;
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
  /* height: 20px; */
  font-size: 13px;
  margin-top: 8px;
  margin-bottom: 12px;
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

const Authentication = ({ userObject, createNotification }) => {
  console.log("Authentication userObject", userObject);

  const history = useHistory();
  const [email, setEmail] = useState(""); // 유저 이메일
  const [password, setPassword] = useState(""); // 유저 비밀번호
  const [displayName, setDisplayName] = useState(""); // 유저 닉네임
  const [isAccount, setIsAccount] = useState(false); // 계정 존재 여부 체크 (true: 계정있음, false: 계정없음)
  const [error, setError] = useState(null); // 로그인 또는 회원가입 에러메시지
  const [isLoginForm, setIsLoginForm] = useState(false); // 로그인 폼
  const [isRegisterForm, setIsRegisterForm] = useState(false); // 회원가입 폼
  const [isLogin, setIsLogin] = useState(false);

  // 이메일, 비밀번호 로그인
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("Authentication authService.currentUser", authService.currentUser);

    try {
      const data1 = await authService.signInWithEmailAndPassword(email, password); // 로그인
      console.log("data1", data1);

      createNotification("SuccessLogin");
      setIsLoginForm(!isLoginForm);
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
    } else if (name === "displayNameInput") {
      setDisplayName(value);
    }
  };

  // 이메일, 비밀번호로 계정 생성후 로그인
  const onClickRegister = async (event) => {
    event.preventDefault();

    try {
      if (!isAccount) {
        await authService.createUserWithEmailAndPassword(email, password); // 이메일, 비밀번호로 계정 생성
        createNotification("SuccessRegister");
        setIsRegisterForm(!isRegisterForm);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      await authService.currentUser.updateProfile({
        displayName,
      });
    }
  };

  // 소셜 로그인
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

      createNotification("SuccessGoogleLogin");
      setIsLoginForm(!isLoginForm);
    } else if (name === "githubLogin") {
      try {
        const githubProvider = new firebaseApp.auth.GithubAuthProvider();
        await authService.signInWithPopup(githubProvider);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }

      createNotification("SuccessGithubLogin");
      setIsLoginForm(!isLoginForm);
    }
  };

  // 홈화면 로그인 버튼
  const handleMainLogin = () => {
    setIsLoginForm(!isLoginForm);
  };

  // 홈화면 회원가입 버튼
  const handleMainRegister = () => {
    setIsRegisterForm(!isRegisterForm);
  };

  // 로그인/회원가입 폼 닫기 버튼
  const handleCloseButton = () => {
    setIsLoginForm(false);
    setIsRegisterForm(false);
  };

  // 홈화면 로그아웃 버튼
  const onClickLogOut = async () => {
    const currentUser = authService.currentUser;

    if (currentUser) {
      await authService.signOut();
      history.push("/");
      createNotification("SuccessLogout");
    }
  };

  // 회원가입 폼으로 이동
  const gotoRegisterForm = () => {
    setIsLoginForm(false);
    setIsRegisterForm(true);
  };

  return (
    <>
      {/* 홈화면 메뉴 */}
      <MenuLoginForm>
        {userObject === null ? (
          <>
            <MenuLoginButton onClick={handleMainLogin}>로그인</MenuLoginButton>
            <MenuLoginButton onClick={handleMainRegister}>회원가입</MenuLoginButton>
          </>
        ) : (
          <MenuLogoutButton onClick={onClickLogOut}>로그아웃</MenuLogoutButton>
        )}
      </MenuLoginForm>

      {/* 로그인 폼 */}
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
                  {/* <IconGoogle src={googleLogo} onClick={onClickSocialLogin}></IconGoogle> */}
                  구글 로그인
                </GoogleLogin>
                <GithubLogin name="githubLogin" onClick={onClickSocialLogin}>
                  {/* <IconGithub icon={faGithub}></IconGithub> */}
                  깃허브 로그인
                </GithubLogin>
                <RegisterButton onClick={gotoRegisterForm}>트위터 회원가입</RegisterButton>
                <CloseButton icon={faTimesCircle} onClick={handleMainLogin}></CloseButton>
              </SocialLoginContainer>
            </LoginFormContent>
          </LoginFormContainer>
        </>
      ) : null}

      {/* 회원가입 폼 */}
      {isRegisterForm ? (
        <>
          <LoginFormContainer>
            <LoginFormContent>
              <IconTwitter icon={faTwitter}></IconTwitter>
              <LoginFormTitle>트위터 회원가입</LoginFormTitle>
              <LoginFormTag onSubmit={onClickRegister}>
                <LoginInputTag name="displayNameInput" type="text" placeholder="닉네임" onChange={onChange} value={displayName} required></LoginInputTag>
                <LoginInputTag name="emailInput" type="text" placeholder="이메일" onChange={onChange} value={email} required></LoginInputTag>
                <LoginInputTag name="passwordInput" type="password" placeholder="비밀번호" onChange={onChange} value={password} required></LoginInputTag>
                <ErrorMessage>{error && error}</ErrorMessage>
                <LoginSubmitTag type="submit" onClick={onClickRegister} value="회원가입"></LoginSubmitTag>
              </LoginFormTag>
              <SocialLoginContainer>
                <CloseButton icon={faTimesCircle} onClick={handleCloseButton}></CloseButton>
              </SocialLoginContainer>
            </LoginFormContent>
          </LoginFormContainer>
        </>
      ) : null}
    </>
  );
};

export default Authentication;
