import { useState } from "react";
import { firebaseApp, authService } from "firebaseConfiguration";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
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
  border: 1px solid #eeeeee;
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;
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
  font-size: 24px;
  cursor: pointer;
  color: gray;

  &:hover {
    color: #303030;
  }
`;

const GoogleLogin = styled.button`
  border: none;
  outline: none;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 11px;
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
  padding: 11px;
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

const IconGoogle = styled.img`
  width: 18px;
  margin-right: 5px;
  margin-bottom: 1px;
`;

const IconGithub = styled(FontAwesomeIcon)`
  font-size: 21px;
  margin-right: 5px;
  margin-bottom: 1px;
`;

const ErrorMessage = styled.h3`
  font-size: 13px;
  margin-top: 8px;
  margin-bottom: 12px;
  color: #eb4d4b;
  font-weight: bold;
`;

const MenuLoginForm = styled.div`
  margin-bottom: 10px;
  margin-top: 17px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const MenuLoginButton = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 15px;
  color: white;
  border-radius: 30px;
  font-size: 15px;
  font-weight: bold;
  background-color: var(--twitter-color);
  margin-right: 8px;

  &:hover {
    background-color: var(--twitter-dark-color);
  }
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
  background-color: var(--twitter-color);

  &:hover {
    background-color: var(--twitter-dark-color);
  }
`;

const DarkModeButton = styled.button`
  font-size: 30px;
  margin-right: 3px;
  margin-left: auto;
`;

const ChangePasswordBtn = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 15px;
  color: white;
  border-radius: 30px;
  font-size: 15px;
  font-weight: bold;
  background-color: var(--twitter-color);

  &:hover {
    background-color: var(--twitter-dark-color);
  }
`;

const ChangeEmailBtn = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 15px;
  color: white;
  border-radius: 30px;
  font-size: 15px;
  font-weight: bold;
  background-color: var(--twitter-color);

  &:hover {
    background-color: var(--twitter-dark-color);
  }
`;

const Authentication = ({ userObject, createNotification, isDark, changeTheme }) => {
  // console.log("Authentication userObject", userObject);

  const history = useHistory();
  const [email, setEmail] = useState(""); // 유저 이메일
  const [password, setPassword] = useState(""); // 유저 비밀번호
  const [displayName, setDisplayName] = useState(""); // 유저 닉네임
  const [newPassword, setNewPassword] = useState(""); // 새로운 비밀번호
  const [newEmail, setNewEmail] = useState(""); // 새로운 이메일
  const [isAccount, setIsAccount] = useState(false); // 계정 존재 여부 체크 (true: 계정있음, false: 계정없음)
  const [error, setError] = useState(null); // 로그인 또는 회원가입 에러메시지
  const [isLoginForm, setIsLoginForm] = useState(false); // 로그인 폼
  const [isRegisterForm, setIsRegisterForm] = useState(false); // 회원가입 폼
  const [isChangePasswordForm, setIsChangePasswordForm] = useState(false); // 비밀번호 변경 폼
  const [isChangeEmailForm, setIsChangeEmailForm] = useState(false); // 이메일 변경 폼
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

        createNotification("SuccessGoogleLogin");
        setIsLoginForm(!isLoginForm);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    } else if (name === "githubLogin") {
      try {
        const githubProvider = new firebaseApp.auth.GithubAuthProvider();
        await authService.signInWithPopup(githubProvider);

        createNotification("SuccessGithubLogin");
        setIsLoginForm(!isLoginForm);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    }
  };

  const onChangePassword = (event) => {
    const {
      target: { value },
    } = event;
    setNewPassword(value);
  };

  // 비밀번호 변경
  const onClickChangePassword = async (event) => {
    event.preventDefault();

    try {
      await authService.currentUser.updatePassword(newPassword);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      history.push("/");
      setIsChangePasswordForm(false);
    }
  };

  const onChangeEmail = (event) => {
    const {
      target: { value },
    } = event;
    setNewEmail(value);
  };

  // 이메일 변경
  const onClickChangeEmail = async (event) => {
    event.preventDefault();

    try {
      await authService.currentUser.updateEmail(newEmail);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      history.push("/");
      setIsChangeEmailForm(false);
    }
  };

  // 홈화면 로그인 버튼
  const handleMainLogin = () => {
    setIsRegisterForm(false);
    setIsLoginForm(!isLoginForm);
  };

  // 홈화면 회원가입 버튼
  const handleMainRegister = () => {
    setIsLoginForm(false);
    setIsRegisterForm(!isRegisterForm);
  };

  // 로그인/회원가입 폼 닫기 버튼
  const handleCloseButton = () => {
    setIsLoginForm(false);
    setIsRegisterForm(false);
    setIsChangePasswordForm(false);
    setIsChangeEmailForm(false);
  };

  // 홈화면 로그아웃 버튼
  const onClickLogOut = async () => {
    const currentUser = authService.currentUser;

    if (currentUser) {
      await authService.signOut();
      createNotification("SuccessLogout");
      history.push("/");
      return;
    }
  };

  // 회원가입 폼으로 이동
  const gotoRegisterForm = () => {
    setIsRegisterForm(true);
    setIsLoginForm(false);
    setIsChangePasswordForm(false);
  };

  // 로그인 폼으로 이동
  const gotoLoginForm = () => {
    setIsLoginForm(true);
    setIsRegisterForm(false);
    setIsChangePasswordForm(false);
    setIsChangeEmailForm(false);
  };

  // 비밀번호 변경 폼으로 이동
  const gotoPasswordForm = () => {
    setIsChangePasswordForm(true);
    setIsRegisterForm(false);
    setIsLoginForm(false);
    setIsChangeEmailForm(false);
  };

  // 이메일 변경 폼으로 이동
  const gotoEmailForm = () => {
    setIsChangeEmailForm(true);
    setIsChangePasswordForm(false);
    setIsRegisterForm(false);
    setIsLoginForm(false);
  };

  // 회원 탈퇴
  const onUnRegister = async () => {
    try {
      await authService.currentUser.delete();
    } catch (error) {
      console.log(error);
    } finally {
      history.push("/");
    }
  };

  // 이메일 인증 후 새로운 이메일로 변경
  const onUpdateNewEmail = async () => {
    try {
      await authService.currentUser.verifyBeforeUpdateEmail("kowonp@gmail.com");
    } catch (error) {
      console.log(error);
    } finally {
      history.push("/");
    }
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
          <>
            <MenuLogoutButton onClick={onClickLogOut}>로그아웃</MenuLogoutButton>
            <ChangePasswordBtn onClick={gotoPasswordForm}>비밀번호 변경</ChangePasswordBtn>
            <ChangePasswordBtn onClick={gotoEmailForm}>이메일 변경</ChangePasswordBtn>
          </>
        )}
        <DarkModeButton onClick={changeTheme}>{isDark ? "🌙" : "🌞"}</DarkModeButton>
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
                  <IconGoogle src={googleLogo}></IconGoogle>
                  구글 로그인
                </GoogleLogin>
                <GithubLogin name="githubLogin" onClick={onClickSocialLogin}>
                  <IconGithub icon={faGithub}></IconGithub>
                  깃허브 로그인
                </GithubLogin>
                <RegisterButton onClick={gotoRegisterForm}>트위터 회원가입</RegisterButton>
                <CloseButton icon={faTimes} onClick={handleMainLogin}></CloseButton>
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
                <RegisterButton onClick={gotoLoginForm}>트위터 로그인</RegisterButton>
                <CloseButton icon={faTimes} onClick={handleCloseButton}></CloseButton>
              </SocialLoginContainer>
            </LoginFormContent>
          </LoginFormContainer>
        </>
      ) : null}

      {/* 비밀번호 변경 폼 */}
      {isChangePasswordForm ? (
        <>
          <LoginFormContainer>
            <LoginFormContent>
              <IconTwitter icon={faTwitter}></IconTwitter>
              <LoginFormTitle>트위터 비밀번호 변경</LoginFormTitle>
              <LoginFormTag onSubmit={onClickChangePassword}>
                <LoginInputTag type="password" placeholder="새로운 비밀번호" onChange={onChangePassword} value={newPassword} required></LoginInputTag>
                <ErrorMessage>{error && error}</ErrorMessage>
                <LoginSubmitTag type="submit" onClick={onClickChangePassword} value="비밀번호 변경"></LoginSubmitTag>
              </LoginFormTag>
              <SocialLoginContainer>
                <CloseButton icon={faTimes} onClick={handleCloseButton}></CloseButton>
              </SocialLoginContainer>
            </LoginFormContent>
          </LoginFormContainer>
        </>
      ) : null}

      {/* 이메일 변경 폼 */}
      {isChangeEmailForm ? (
        <>
          <LoginFormContainer>
            <LoginFormContent>
              <IconTwitter icon={faTwitter}></IconTwitter>
              <LoginFormTitle>트위터 이메일 변경</LoginFormTitle>
              <LoginFormTag onSubmit={onClickChangeEmail}>
                <LoginInputTag type="email" placeholder="새로운 이메일" onChange={onChangeEmail} value={newEmail} required></LoginInputTag>
                <ErrorMessage>{error && error}</ErrorMessage>
                <LoginSubmitTag type="submit" onClick={onClickChangeEmail} value="이메일 변경"></LoginSubmitTag>
              </LoginFormTag>
              <SocialLoginContainer>
                <CloseButton icon={faTimes} onClick={handleCloseButton}></CloseButton>
              </SocialLoginContainer>
            </LoginFormContent>
          </LoginFormContainer>
        </>
      ) : null}
    </>
  );
};

export default Authentication;
