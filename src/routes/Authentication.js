import { useState } from "react";
import { firebaseApp, authService } from "firebaseConfiguration";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import googleLogo from "../images/google-logo.svg";
import { useHistory } from "react-router-dom";

const LoginFormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  height: 580px;
  z-index: 10;
  background-color: white;
  border-radius: 20px;
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;
  background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#f8f8f8")};
  border: 1px solid ${(props) => (props.current === "true" ? "#404040" : "#eee")};
`;

const PWEmailFormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  height: 380px;
  z-index: 10;
  background-color: white;
  border-radius: 20px;
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;
  background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#f8f8f8")};
  border: 1px solid ${(props) => (props.current === "true" ? "#404040" : "#eee")};
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
  position: relative;

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
    color: ${(props) => (props.current === "true" ? "#DCDCDC" : "#303030")};
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
  padding: 10px 12px;
  color: white;
  border-radius: 30px;
  font-size: 13px;
  font-weight: bold;
  background-color: var(--twitter-color);
  margin-right: 5px;

  &:hover {
    background-color: var(--twitter-dark-color);
  }
`;

const MenuLogoutButton = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 12px;
  color: white;
  border-radius: 30px;
  font-size: 13px;
  font-weight: bold;
  background-color: var(--twitter-color);
  margin-right: 5px;

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
  padding: 10px 12px;
  color: white;
  border-radius: 30px;
  font-size: 13px;
  font-weight: bold;
  background-color: #a4b0be;

  margin-right: 5px;

  &:hover {
    background-color: #57606f;
  }
`;

const ChangeEmailBtn = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 12px;
  color: white;
  border-radius: 30px;
  font-size: 13px;
  font-weight: bold;
  background-color: #747d8c;

  &:hover {
    background-color: #2f3542;
  }
`;

const Authentication = ({ userObject, createNotification, isDark, changeTheme }) => {
  const history = useHistory();
  const [email, setEmail] = useState(""); // ?????? ?????????
  const [password, setPassword] = useState(""); // ?????? ????????????
  const [displayName, setDisplayName] = useState(""); // ?????? ?????????
  const [newPassword, setNewPassword] = useState(""); // ????????? ????????????
  const [newEmail, setNewEmail] = useState(""); // ????????? ?????????
  const [isAccount] = useState(false); // ?????? ?????? ?????? ?????? (true: ????????????, false: ????????????)
  const [error, setError] = useState(null); // ????????? ?????? ???????????? ???????????????
  const [isLoginForm, setIsLoginForm] = useState(false); // ????????? ???
  const [isRegisterForm, setIsRegisterForm] = useState(false); // ???????????? ???
  const [isChangePasswordForm, setIsChangePasswordForm] = useState(false); // ???????????? ?????? ???
  const [isChangeEmailForm, setIsChangeEmailForm] = useState(false); // ????????? ?????? ???

  // ?????????, ???????????? ?????????
  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      await authService.signInWithEmailAndPassword(email, password); // ?????????
      createNotification("SuccessLogin");
      setIsLoginForm(!isLoginForm);
    } catch (error) {
      console.log(error);
      setError(error.message);
      createNotification("FailLogin");
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

  // ?????????, ??????????????? ?????? ????????? ?????????
  const onClickRegister = async (event) => {
    event.preventDefault();

    try {
      if (!isAccount) {
        await authService.createUserWithEmailAndPassword(email, password); // ?????????, ??????????????? ?????? ??????
        await authService.currentUser?.updateProfile({
          displayName,
        });
        createNotification("SuccessRegister");
        setIsRegisterForm(!isRegisterForm);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
    }
  };

  // ?????? ?????????
  const onClickSocialLogin = async (event) => {
    const {
      target: { name },
    } = event;

    if (name === "googleLogin") {
      try {
        const googleProvider = new firebaseApp.auth.GoogleAuthProvider();
        await authService.signInWithPopup(googleProvider);
        setIsLoginForm(!isLoginForm);
        createNotification("SuccessGoogleLogin");
      } catch (error) {
        console.log(error);
        setError(error.message);
        createNotification("FailGoogleLogin");
      }
    } else if (name === "githubLogin") {
      try {
        const githubProvider = new firebaseApp.auth.GithubAuthProvider();
        await authService.signInWithPopup(githubProvider);
        setIsLoginForm(!isLoginForm);
        createNotification("SuccessGithubLogin");
      } catch (error) {
        console.log(error);
        setError(error.message);
        createNotification("FailGithubLogin");
      }
    }
  };

  const onChangePassword = (event) => {
    const {
      target: { value },
    } = event;

    setNewPassword(value);
  };

  // ???????????? ??????
  const onClickChangePassword = async (event) => {
    event.preventDefault();

    try {
      await authService.currentUser.updatePassword(newPassword);
      setIsChangePasswordForm(false);
      createNotification("SuccessChangePassword");
    } catch (error) {
      console.log(error);
      setError(error.message);
      createNotification("FailChangePassword");
    } finally {
      history.push("/");
    }
  };

  const onChangeEmail = (event) => {
    const {
      target: { value },
    } = event;

    setNewEmail(value);
  };

  // ????????? ??????
  const onClickChangeEmail = async (event) => {
    event.preventDefault();

    try {
      await authService.currentUser.updateEmail(newEmail);
      setIsChangeEmailForm(false);
      createNotification("SuccessChangeEmail");
    } catch (error) {
      console.log(error);
      setError(error.message);
      createNotification("FailChangeEmail");
    } finally {
      history.push("/");
    }
  };

  // ????????? ????????? ??????
  const handleMainLogin = () => {
    setIsRegisterForm(false);
    setIsLoginForm(!isLoginForm);
  };

  // ????????? ???????????? ??????
  const handleMainRegister = () => {
    setIsLoginForm(false);
    setIsRegisterForm(!isRegisterForm);
  };

  // ?????????/???????????? ??? ?????? ??????
  const handleCloseButton = () => {
    setIsLoginForm(false);
    setIsRegisterForm(false);
    setIsChangePasswordForm(false);
    setIsChangeEmailForm(false);
  };

  // ????????? ???????????? ??????
  const onClickLogOut = async () => {
    const currentUser = authService.currentUser;

    if (currentUser) {
      await authService.signOut();
      createNotification("SuccessLogout");
      history.push("/");
      return;
    }
  };

  // ???????????? ????????? ??????
  const gotoRegisterForm = () => {
    setIsRegisterForm(true);
    setIsLoginForm(false);
    setIsChangePasswordForm(false);
    setIsChangeEmailForm(false);
  };

  // ????????? ????????? ??????
  const gotoLoginForm = () => {
    setIsLoginForm(true);
    setIsRegisterForm(false);
    setIsChangePasswordForm(false);
    setIsChangeEmailForm(false);
  };

  // ???????????? ?????? ????????? ??????
  const gotoPasswordForm = () => {
    setIsChangePasswordForm(true);
    setIsRegisterForm(false);
    setIsLoginForm(false);
    setIsChangeEmailForm(false);
  };

  // ????????? ?????? ????????? ??????
  const gotoEmailForm = () => {
    setIsChangeEmailForm(true);
    setIsChangePasswordForm(false);
    setIsRegisterForm(false);
    setIsLoginForm(false);
  };

  /*
  // ?????? ??????
  const onUnRegister = async () => {
    try {
      await authService.currentUser.delete();
    } catch (error) {
      console.log(error);
    } finally {
      history.push("/");
    }
  };
  */

  /*
  // ????????? ?????? ??? ????????? ???????????? ??????
  const onUpdateNewEmail = async () => {
    try {
      await authService.currentUser.verifyBeforeUpdateEmail("kowonp@gmail.com");
    } catch (error) {
      console.log(error);
    } finally {
      history.push("/");
    }
  };
  */

  return (
    <>
      {/* ????????? ?????? */}
      <MenuLoginForm>
        {userObject === null ? (
          <>
            <MenuLoginButton type="button" onClick={handleMainLogin}>
              ?????????
            </MenuLoginButton>
            <MenuLoginButton type="button" onClick={handleMainRegister}>
              ????????????
            </MenuLoginButton>
          </>
        ) : (
          <>
            <MenuLogoutButton type="button" onClick={onClickLogOut}>
              ????????????
            </MenuLogoutButton>
            <ChangePasswordBtn type="button" onClick={gotoPasswordForm}>
              ???????????? ??????
            </ChangePasswordBtn>
            <ChangeEmailBtn type="button" onClick={gotoEmailForm}>
              ????????? ??????
            </ChangeEmailBtn>
          </>
        )}
        <DarkModeButton type="button" onClick={changeTheme}>
          {isDark ? "????" : "????"}
        </DarkModeButton>
      </MenuLoginForm>

      {/* ????????? ??? */}
      {isLoginForm ? (
        <>
          <LoginFormContainer current={isDark ? "true" : "false"}>
            <LoginFormContent>
              <IconTwitter icon={faTwitter}></IconTwitter>
              <LoginFormTitle>????????? ?????????</LoginFormTitle>
              <LoginFormTag onSubmit={onSubmit}>
                <LoginInputTag name="emailInput" type="text" placeholder="?????????" onChange={onChange} value={email} required></LoginInputTag>
                <LoginInputTag name="passwordInput" type="password" placeholder="????????????" onChange={onChange} value={password} required></LoginInputTag>
                <ErrorMessage>{error && error}</ErrorMessage>
                <LoginSubmitTag type="submit" onClick={onSubmit} value="?????????"></LoginSubmitTag>
              </LoginFormTag>
              <SocialLoginContainer>
                <GoogleLogin name="googleLogin" type="submit" onClick={onClickSocialLogin}>
                  <IconGoogle src={googleLogo}></IconGoogle>
                  ?????? ?????????
                </GoogleLogin>
                <GithubLogin name="githubLogin" type="submit" onClick={onClickSocialLogin}>
                  <IconGithub icon={faGithub}></IconGithub>
                  ????????? ?????????
                </GithubLogin>
                <RegisterButton type="button" onClick={gotoRegisterForm}>
                  ????????? ????????????
                </RegisterButton>
                <CloseButton current={isDark ? "true" : "false"} icon={faTimes} type="button" onClick={handleMainLogin}></CloseButton>
              </SocialLoginContainer>
            </LoginFormContent>
          </LoginFormContainer>
        </>
      ) : null}

      {/* ???????????? ??? */}
      {isRegisterForm ? (
        <>
          <LoginFormContainer current={isDark ? "true" : "false"}>
            <LoginFormContent>
              <IconTwitter icon={faTwitter}></IconTwitter>
              <LoginFormTitle>????????? ????????????</LoginFormTitle>
              <LoginFormTag onSubmit={onClickRegister}>
                <LoginInputTag name="displayNameInput" type="text" placeholder="?????????" onChange={onChange} value={displayName} required></LoginInputTag>
                <LoginInputTag name="emailInput" type="text" placeholder="?????????" onChange={onChange} value={email} required></LoginInputTag>
                <LoginInputTag name="passwordInput" type="password" placeholder="????????????" onChange={onChange} value={password} required></LoginInputTag>
                <ErrorMessage>{error && error}</ErrorMessage>
                <LoginSubmitTag type="submit" onClick={onClickRegister} value="????????????"></LoginSubmitTag>
              </LoginFormTag>
              <SocialLoginContainer>
                <RegisterButton type="button" onClick={gotoLoginForm}>
                  ????????? ?????????
                </RegisterButton>
                <CloseButton current={isDark ? "true" : "false"} icon={faTimes} type="button" onClick={handleCloseButton}></CloseButton>
              </SocialLoginContainer>
            </LoginFormContent>
          </LoginFormContainer>
        </>
      ) : null}

      {/* ???????????? ?????? ??? */}
      {isChangePasswordForm ? (
        <>
          <PWEmailFormContainer current={isDark ? "true" : "false"}>
            <LoginFormContent>
              <IconTwitter icon={faTwitter}></IconTwitter>
              <LoginFormTitle>????????? ???????????? ??????</LoginFormTitle>
              <LoginFormTag onSubmit={onClickChangePassword}>
                <LoginInputTag type="password" placeholder="????????? ????????????" onChange={onChangePassword} value={newPassword} required></LoginInputTag>
                <ErrorMessage>{error && error}</ErrorMessage>
                <LoginSubmitTag type="submit" onClick={onClickChangePassword} value="???????????? ??????"></LoginSubmitTag>
              </LoginFormTag>
              <SocialLoginContainer>
                <CloseButton current={isDark ? "true" : "false"} icon={faTimes} type="button" onClick={handleCloseButton}></CloseButton>
              </SocialLoginContainer>
            </LoginFormContent>
          </PWEmailFormContainer>
        </>
      ) : null}

      {/* ????????? ?????? ??? */}
      {isChangeEmailForm ? (
        <>
          <PWEmailFormContainer current={isDark ? "true" : "false"}>
            <LoginFormContent>
              <IconTwitter icon={faTwitter}></IconTwitter>
              <LoginFormTitle>????????? ????????? ??????</LoginFormTitle>
              <LoginFormTag onSubmit={onClickChangeEmail}>
                <LoginInputTag type="email" placeholder="????????? ?????????" onChange={onChangeEmail} value={newEmail} required></LoginInputTag>
                <ErrorMessage>{error && error}</ErrorMessage>
                <LoginSubmitTag type="submit" onClick={onClickChangeEmail} value="????????? ??????"></LoginSubmitTag>
              </LoginFormTag>
              <SocialLoginContainer>
                <CloseButton current={isDark ? "true" : "false"} icon={faTimes} type="button" onClick={handleCloseButton}></CloseButton>
              </SocialLoginContainer>
            </LoginFormContent>
          </PWEmailFormContainer>
        </>
      ) : null}
    </>
  );
};

Authentication.propTypes = {
  userObject: PropTypes.object,
  createNotification: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
  changeTheme: PropTypes.func.isRequired,
};

export default Authentication;
