import { useRef, useEffect, useState } from "react";
import { authService, firestoreService, storageService } from "firebaseConfiguration";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle, faSignOutAlt, faCamera, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import userImage from "images/user.png";

const ProfileContainer = styled.div``;

const ProfileEdit = styled.div``;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const ProfileImageContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 17px;
  margin-top: 40px;
`;

const ProfileFormImage = styled.img`
  border-radius: 50%;
  width: 120px;
  height: 120px;
  border: 5px solid #d0d0d0;
  cursor: pointer;
`;

const ProfileButtons = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileFormSubmit = styled.input`
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

const TweetFormDisplayNameLabel = styled.label``;

const IconUserEdit = styled(FontAwesomeIcon)`
  font-size: 24px;
  cursor: pointer;
  color: #bebebe;
  border-radius: 50%;
  margin-right: 10px;

  &:hover {
    color: var(--twitter-color);
  }
`;

const ProfileFormDisplayName = styled.input`
  border: none;
  outline: none;
  font-size: 20px;
  font-weight: bold;
  margin-top: 16px;
  margin-bottom: 6px;
  margin-left: 14px;
  color: ${(props) => (props.current === "true" ? "#989898" : "black")};
  background-color: transparent;

  &::placeholder {
    font-size: 17px;
  }
`;

const ProfileFormFile = styled.input``;

const TweetFormImageLabel = styled.label`
  position: relative;
`;

const IconCamera = styled(FontAwesomeIcon)`
  font-size: 25px;
  cursor: pointer;
  padding: 7px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${(props) => (props.current === "true" ? "white" : "#bebebe")};

  &:hover {
    color: var(--twitter-color);
    background-color: ${(props) => (props.current === "true" ? "white" : "#e6f3ff")};
  }
`;

const ProfileInfo = styled.div`
  padding: 0 17px;
`;

const ProfileDisplayName = styled.div``;

const ProfileEmailContainer = styled.div`
  display: flex;
`;

const ProfileEmail = styled.h1`
  font-size: 17px;
  margin-right: 5px;
  color: gray;
`;

const ProfileEmailVerified = styled(FontAwesomeIcon)`
  color: var(--twitter-color);
`;

const ProfileCreation = styled.div`
  margin-top: 15px;
`;

const ProfileLastSignIn = styled.div`
  margin-top: 4px;
`;

const IconProfileCreation = styled(FontAwesomeIcon)`
  color: gray;
  margin-right: 5px;
`;

const IconProfileSignIn = styled(FontAwesomeIcon)`
  color: gray;
  margin-right: 3px;
`;

const ProfileTweet = styled.div`
  margin-top: 20px;
`;

// ????????? ?????? ??????
const PostingMyTweetContainer = styled.div`
  margin-top: 50px;
  border-top: 1px solid ${(props) => (props.current === "true" ? "#1e2125" : "#eee")};

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const PostingMyTweetTitle = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin-left: 17px;
  margin-top: 25px;
  margin-bottom: 20px;
`;

const PostingMyTweet = styled.div`
  display: flex;
  padding: 10px 17px;
  cursor: pointer;
  border-bottom: 1px solid ${(props) => (props.current === "true" ? "#1e2125" : "#eee")};
  background-color: ${(props) => (props.current === "true" ? "#0F0F0F" : "#ffffff")};

  &:hover {
    background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#f8f8f8")};
  }
  &:last-child {
    border-bottom: none;
  }
`;

const PostingTweetAuthorImage = styled.img`
  width: 47px;
  height: 47px;
  border-radius: 50%;
  margin-right: 17px;
`;

const PostingTweetContent = styled.div`
  width: 100%;
`;

const PostingTweetAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
`;

const AuthorName = styled.h2`
  font-size: 17px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const AuthorEmail = styled.h3`
  font-size: 16px;
  margin-left: 7px;
  color: gray;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const AuthorCreatedAt = styled.h4`
  font-size: 14px;
  color: gray;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const AuthorDot = styled.span`
  font-size: 15px;
  margin: 0 5px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const PostingTweetDesc = styled.p`
  margin-bottom: 8px;
  font-size: 16px;
  line-height: 1.5;
`;

const PostingTweetImage = styled.img`
  width: 490px;
  height: 280px;
  border-radius: 15px;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const Profile = ({ userObject, refreshDisplayName, createNotification, isDark }) => {
  const creationTime = userObject?.creationTime;
  const lastSignInTime = userObject?.lastSignInTime;
  const [newDisplayName, setNewDisplayName] = useState(authService.currentUser?.displayName);
  const [myTweets, setMyTweets] = useState([]);
  const [fileDataUrl, setFileDataUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const fileImageInput = useRef();
  let fileDownloadUrl = "";

  const getTime = (time) => {
    const now = parseInt(time);
    const date = new Date(now);
    const getFullYear = date.getFullYear();
    const getMonth = date.getMonth() + 1;
    const getDate = date.getDate();
    return `${getFullYear}??? ${getMonth}??? ${getDate}???`;
  };

  const getMyTweets = async () => {
    const tweets = await firestoreService.collection("tweets").where("uid", "==", userObject.uid).orderBy("createdAtTime", "desc").get();
    // Document?????? ????????? ????????? ???????????? ????????????
    // tweets.docs.map((doc)=>doc.get("content"))

    // Document?????? ?????? ????????? ????????? ????????????
    // tweets.docs.map((doc)=>doc.data())

    const myTweetsArray = tweets.docs.map((doc) => ({
      ...doc.data(),
    }));
    setMyTweets(myTweetsArray);
  };

  // ????????? ?????? (????????? ????????????)
  const onSubmit = async (event) => {
    // authService.currentUser: ?????? ???????????? ????????? ??????
    event.preventDefault();

    if (fileDataUrl !== "") {
      const fileReference = storageService.ref().child(`${userObject.email}/profile/${fileName}`);
      const uploadTask = await fileReference.putString(fileDataUrl, "data_url");
      fileDownloadUrl = await uploadTask.ref.getDownloadURL();
    }

    // firebase.User = userObject: ?????? ???????????? ????????? ??????
    await userObject.updateProfile({
      displayName: newDisplayName,
      photoURL: fileDownloadUrl,
    });

    refreshDisplayName();
    createNotification("SuccessProfile");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const uploadFile = files[0];
    const uploadFileName = uploadFile?.name;
    const fileReader = new FileReader();

    if (fileReader && uploadFile !== undefined && uploadFile !== null) {
      fileReader.onload = (event) => {
        const {
          target: { result },
        } = event;
        setFileDataUrl(result);
        fileImageInput.current.src = result;
      };
      fileReader.readAsDataURL(uploadFile);
    }
    setFileName(`${uploadFileName}_${Date.now()}`);
  };

  const onClickPostingImage = (event) => {
    const {
      target: { src },
    } = event;

    if (src) {
      window.open(src);
    }
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  return (
    <>
      <Helmet>
        <title>{`????????? / ${userObject?.email && userObject.email} ?????????`}</title>
      </Helmet>
      <ProfileContainer>
        <ProfileEdit>
          <ProfileForm onSubmit={onSubmit}>
            <ProfileImageContainer>
              <TweetFormImageLabel htmlFor="profilePhotoInput">
                <ProfileFormImage ref={fileImageInput} src={userObject?.photoURL ? userObject.photoURL : userImage} alt={userObject?.email}></ProfileFormImage>
                <IconCamera icon={faCamera} current={isDark ? "true" : "false"}></IconCamera>
              </TweetFormImageLabel>
              <ProfileButtons>
                <TweetFormDisplayNameLabel htmlFor="displayNameInput">
                  <IconUserEdit icon={faUserEdit}></IconUserEdit>
                </TweetFormDisplayNameLabel>
                <ProfileFormSubmit id="displayNameBtn" type="submit" value="????????? ??????"></ProfileFormSubmit>
              </ProfileButtons>
            </ProfileImageContainer>
            <ProfileFormDisplayName
              id="displayNameInput"
              type="text"
              placeholder="????????? ??????????????????."
              onChange={onChange}
              value={newDisplayName ? newDisplayName : ""}
              minLength={2}
              maxLength={10}
              current={isDark ? "true" : "false"}
              required
            ></ProfileFormDisplayName>
            <ProfileFormFile id="profilePhotoInput" type="file" accept="image/*" onChange={onFileChange} style={{ display: "none" }}></ProfileFormFile>
          </ProfileForm>
          <ProfileInfo>
            <ProfileDisplayName></ProfileDisplayName>
            <ProfileEmailContainer>
              <ProfileEmail>{userObject?.email}</ProfileEmail>
              {!userObject?.emailVerified === true && <ProfileEmailVerified icon={faCheckCircle}></ProfileEmailVerified>}
            </ProfileEmailContainer>
            <ProfileCreation>
              <IconProfileCreation icon={faCalendarAlt}></IconProfileCreation>
              ?????? ?????????: {getTime(creationTime)}
            </ProfileCreation>
            <ProfileLastSignIn>
              <IconProfileSignIn icon={faSignOutAlt}></IconProfileSignIn>
              ????????? ?????????: {getTime(lastSignInTime)}
            </ProfileLastSignIn>
          </ProfileInfo>
        </ProfileEdit>
        <ProfileTweet>
          {myTweets && myTweets.length > 0 ? (
            <PostingMyTweetContainer current={isDark ? "true" : "false"}>
              <PostingMyTweetTitle>????????? ?????? ({myTweets.length})</PostingMyTweetTitle>
              {myTweets.map((myTweet, index) => {
                return (
                  <PostingMyTweet key={index} current={isDark ? "true" : "false"}>
                    <PostingTweetAuthorImage src={myTweet.photoURL ? myTweet.photoURL : userImage} alt={myTweet.displayName}></PostingTweetAuthorImage>
                    <PostingTweetContent>
                      <PostingTweetAuthor>
                        <AuthorInfo>
                          <AuthorName>{myTweet.displayName}</AuthorName>
                          <AuthorEmail>{myTweet.email}</AuthorEmail>
                          <AuthorDot>??</AuthorDot>
                          <AuthorCreatedAt>{getTime(myTweet.createdAtTime).slice(6, 12)}</AuthorCreatedAt>
                        </AuthorInfo>
                      </PostingTweetAuthor>
                      <PostingTweetDesc>{myTweet.content}</PostingTweetDesc>
                      {myTweet.fileDownloadUrl && <PostingTweetImage src={myTweet.fileDownloadUrl} alt={myTweet.content} onClick={onClickPostingImage}></PostingTweetImage>}
                    </PostingTweetContent>
                  </PostingMyTweet>
                );
              })}
            </PostingMyTweetContainer>
          ) : null}
        </ProfileTweet>
      </ProfileContainer>
    </>
  );
};

Profile.propTypes = {
  userObject: PropTypes.object,
  refreshDisplayName: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export default Profile;
