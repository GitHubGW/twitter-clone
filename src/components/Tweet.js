import { useState } from "react";
import { firestoreService, storageService } from "firebaseConfiguration";
import styled from "styled-components";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeart2, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faEdit, faHeart, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import userImage from "images/user.png";

const PostingTweetContainer = styled.div`
  display: flex;
  padding: 10px 17px;
  background-color: ${(props) => props.currentLight && "#f8f8f8"};
  background-color: ${(props) => props.currentDark && "#1e2125"};
  border-bottom: 1px solid ${(props) => (props.current === "true" ? "#1e2125" : "#eee")};

  &:hover {
    background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#f8f8f8")};
  }
`;

const PostingTweetAuthorImage = styled.img`
  width: 47px;
  height: 47px;
  border-radius: 50%;
  margin-right: 17px;
  cursor: pointer;

  @media (max-width: 768px) {
    margin-right: 10px;
  }
`;

const PostingTweetContent = styled.div`
  width: 100%;
`;

const EditingTweetForm = styled.form`
  width: 100%;
`;

const PostingTweetAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const PostingEditDelete = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
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

const PostingEditTweetDesc = styled.textarea`
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 1.5;
  border: none;
  outline: none;
  width: 100%;
  padding: 10px 12px;
  box-sizing: border-box;
  margin-top: 7px;
  color: #989898;
  border-radius: 5px;
  resize: none;
  background-color: ${(props) => props.currentLight && "white"};
  background-color: ${(props) => props.currentDark && "#404040"};

  &::-webkit-scrollbar {
    width: 11px;
    height: 11px;
    background: #ffffff;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background-color: #787878;

    &:hover {
      background-color: #c0c0c0;
    }
    &:active {
      background-color: #c0c0c0;
    }
  }
  &::-webkit-scrollbar-track {
    background-color: lightgray;
  }
`;

const PostingTweetImage = styled.img`
  width: 490px;
  height: 280px;
  border-radius: 15px;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const PostingTweetLike = styled.button`
  margin-top: 8px;
  display: flex;
  align-items: center;
  margin-left: -10px;
`;

const PostingTweetEdit = styled.button``;

const PostingTweetDelete = styled.button``;

const IconTweetLike = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 17px;
  color: #f91880;
  padding: 10px;

  &:hover {
    background-color: rgba(249, 24, 128, 0.2);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const IconTweetLikeNumber = styled.span`
  color: #f91880;
  font-size: 15px;
  font-weight: 500;
  margin-left: 5px;
`;

const IconTweetEdit = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 18px;
  color: gray;
  padding: 10px;
  border-radius: 50%;

  &:hover {
    color: var(--twitter-color);
    background-color: ${(props) => (props.current === "true" ? "#404040" : "#e6f3ff")};
  }

  @media (max-width: 768px) {
    padding: 0;
    font-size: 15px;
    margin-right: 10px;
  }
`;

const IconTweetDelete = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 18px;
  color: gray;
  padding: 10px;
  border-radius: 50%;

  &:hover {
    color: var(--twitter-color);
    background-color: ${(props) => (props.current === "true" ? "#404040" : "#e6f3ff")};
  }

  @media (max-width: 768px) {
    padding: 0;
    font-size: 15px;
  }
`;

const EditTweetBtn = styled.button`
  padding: 6px 10px;
  color: white;
  border-radius: 30px;
  font-size: 14px;
  font-weight: bold;
  background-color: #74b9ff;

  &:hover {
    background-color: rgb(29, 161, 242);
  }
`;

const DeleteTweetBtn = styled.button`
  margin-left: 4px;
  padding: 6px 10px;
  color: white;
  border-radius: 30px;
  font-size: 14px;
  font-weight: bold;
  background-color: #ff7979;

  &:hover {
    background-color: #eb4d4b;
  }
`;

const IconSVGContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 7px;
`;

const IconHeartContainer = styled.div`
  display: flex;
  align-items: center;
  width: 50px;
`;

const IconSVG = styled.svg`
  height: 20px;
  cursor: pointer;
  border-radius: 50%;
  padding: 5px;

  &:hover {
    fill: ${(props) => (props.current === "true" ? "#1DA1F2" : "#bebebe")};
    background-color: ${(props) => (props.current === "true" ? "#2E3336" : "#e6f3ff")};
  }
`;

const IconG = styled.g``;

const IconPath = styled.path``;

// 팔로워 폼
const LoginFormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 625px;
  height: 700px;
  overflow-y: scroll;
  z-index: 10;
  background-color: white;
  border-radius: 20px;
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;
  background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#f8f8f8")};
  border: 1px solid ${(props) => (props.current === "true" ? "#404040" : "#eee")};

  &::-webkit-scrollbar {
    width: 11px;
    height: 11px;
    background: #ffffff;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background-color: #787878;

    &:hover {
      background-color: #444;
    }
    &:active {
      background-color: #444;
    }
  }
  &::-webkit-scrollbar-track {
    background-color: lightgray;
  }
`;

const LoginFormContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 35px;
  align-items: flex-start;
`;

const CloseButton = styled(FontAwesomeIcon)`
  position: absolute;
  top: 30px;
  right: 38px;
  font-size: 28px;
  cursor: pointer;
  color: gray;

  &:hover {
    color: ${(props) => (props.current === "true" ? "#DCDCDC" : "#303030")};
  }
`;

const PostingTweetFollowerContainer = styled.div`
  margin-top: 18px;
`;

const PostingTweetTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 32px;
`;

const PostingTweetFollower = styled.div`
  display: flex;
  margin-bottom: 30px;
`;

const ModalContainer = styled(Modal)`
  height: 100vh;
`;

const ModalImage = styled.img`
  width: 560px;
  height: 340px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
`;

const ModalCloseButton = styled(FontAwesomeIcon)`
  border: none;
  outline: none;
  cursor: pointer;
  padding: 8px 12px;
  color: white;
  border-radius: 50%;
  font-size: 25px;
  font-weight: bold;
  background-color: #a4b0be;
  margin-left: 20px;
  margin-top: 20px;
`;

const Tweet = ({ userObject, tweetObject, isOwner, createNotification, isDark }) => {
  // userObject는 현재 로그인한 유저, tweetObject는 해당 트윗을 작성한 유저
  // console.log("Tweet.js tweetObject", tweetObject);
  // console.log("Tweet.js userObject", userObject);

  const [isEditing, setIsEditing] = useState(false); // 현재 트윗을 수정 중인지 확인
  const [editingTweet, setEditingTweet] = useState(tweetObject.content); // 수정 중인 트윗 내용을 가져옴
  const [isLike, setIsLike] = useState(false); // 좋아요를 눌렀는지 체크(Local)
  const [isHeart, setIsHeart] = useState(tweetObject.likesArray.includes(userObject?.email)); // 좋아요를 눌렀는지 체크(DB)
  const [searchTweetLength, setSearchTweetsLength] = useState(0);
  const [searchTweet, setSearchTweets] = useState("");
  const [isFollower, setIsFollower] = useState(false);
  const [isSearchTweetAuthor, setSearchTweetAuthor] = useState("유저");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  Modal.setAppElement("#root");

  const handleOpenModal = (event) => {
    const {
      target: { src },
    } = event;

    setModalImageSrc(src);
    setIsOpen(true);
  };

  const handleAfterOpenModal = () => {};

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const getTime = (time) => {
    const now = parseInt(time);
    const date = new Date(now);
    const day = ["일", "월", "화", "수", "목", "금", "토"];
    const getMonth = date.getMonth() + 1;
    const getDate = date.getDate();
    const getDay = day[date.getDay()];
    return `${getMonth}월 ${getDate}일 (${getDay})`;
  };

  // 트윗 수정 버튼
  const onSubmit = async (event) => {
    event.preventDefault();

    await firestoreService.collection("tweets").doc(`${tweetObject.documentId}`).update({
      content: editingTweet,
    });

    setIsEditing(false);
    createNotification("SuccessEditTweet");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setEditingTweet(value);
  };

  const onEditTweet = () => {
    setIsEditing(true);
    setEditingTweet(tweetObject.content);
  };

  // 트윗 삭제 버튼 (아이콘)
  const onDeleteTweet = async () => {
    const booleanDeleteTweet = window.confirm("트윗을 삭제하시겠습니까?");

    if (booleanDeleteTweet) {
      // await firestoreService.doc(`${"tweets"}/${tweetObject.documentId}`).delete();
      await firestoreService.collection("tweets").doc(`${tweetObject.documentId}`).delete(); // Cloud Firestore(DB)에서 트윗 삭제

      if (tweetObject.fileDownloadUrl) {
        await storageService.refFromURL(tweetObject.fileDownloadUrl).delete(); // Storage에서 파일 삭제
      }
    }

    createNotification("SuccessDeleteTweet");
  };

  // 트윗 취소 버튼
  const onCancelTweet = () => {
    setEditingTweet(editingTweet);
    setIsEditing(false);
  };

  // 좋아요 버튼
  const handleLikeBtn = async () => {
    if (userObject === null) {
      createNotification("NotLogin");
      return;
    }

    const totalLikesArray = [userObject.email, ...tweetObject.likesArray];
    const checkTotalLikesArray = tweetObject.likesArray.includes(userObject.email);

    if (checkTotalLikesArray) {
      const filteredLikesArray = totalLikesArray.filter((value, index) => {
        return value !== userObject.email;
      });

      await firestoreService.collection("tweets").doc(`${tweetObject.documentId}`).update({
        likesArray: filteredLikesArray,
        clickLikes: false,
      });

      setIsLike(false);
      setIsHeart(false);
      return;
    }

    if (isLike === false) {
      await firestoreService
        .collection("tweets")
        .doc(`${tweetObject.documentId}`)
        .update({
          likesArray: [...new Set(totalLikesArray)],
          clickLikes: true,
        });

      setIsHeart(true);
    } else if (isLike === true) {
      const filteredLikesArray = totalLikesArray.filter((value, index) => {
        return value !== userObject.email;
      });

      await firestoreService.collection("tweets").doc(`${tweetObject.documentId}`).update({
        likesArray: filteredLikesArray,
        clickLikes: false,
      });

      setIsHeart(false);
    }

    setIsLike(!isLike);
  };

  const handleNothing = () => {};

  const handlePostingTweet = async (uid) => {
    await firestoreService
      .collection("tweets")
      .where("uid", "==", uid)
      .orderBy("createdAtTime", "desc")
      .onSnapshot((querySnapshot) => {
        const querySnapshotSize = querySnapshot.size;
        const queryDocumentSnapshotObjectArray = querySnapshot.docs.map((queryDocumentSnapshot) => ({
          id: queryDocumentSnapshot.id,
          documentId: queryDocumentSnapshot.id,
          ...queryDocumentSnapshot.data(),
        }));

        setSearchTweetsLength(querySnapshotSize);
        setSearchTweets(queryDocumentSnapshotObjectArray);
        setSearchTweetAuthor(queryDocumentSnapshotObjectArray[0]?.displayName);
      });
    setIsFollower(!isFollower);
  };

  const handleCloseFollower = () => {
    setIsFollower(false);
  };

  return (
    <PostingTweetContainer
      current={isDark ? "true" : "false"}
      currentLight={isEditing === true && isDark === false && true}
      currentDark={isEditing === true && isDark === true && true}
    >
      {/* 트윗을 현재 수정중인지 확인 */}
      {isEditing ? (
        <>
          {isOwner && (
            <>
              <PostingTweetAuthorImage src={tweetObject.photoURL ? tweetObject.photoURL : userImage}></PostingTweetAuthorImage>
              <EditingTweetForm>
                <PostingTweetContent>
                  <PostingTweetAuthor>
                    <AuthorInfo>
                      <AuthorName>{tweetObject.displayName}</AuthorName>
                      <AuthorEmail>{tweetObject.email}</AuthorEmail>
                      <AuthorDot>·</AuthorDot>
                      <AuthorCreatedAt>{getTime(tweetObject.createdAtTime)}</AuthorCreatedAt>
                    </AuthorInfo>
                    <PostingEditDelete>
                      {isOwner && (
                        <>
                          <EditTweetBtn type="submit" onClick={onSubmit}>
                            수정
                          </EditTweetBtn>
                          <DeleteTweetBtn type="button" onClick={onCancelTweet}>
                            취소
                          </DeleteTweetBtn>
                        </>
                      )}
                    </PostingEditDelete>
                  </PostingTweetAuthor>
                  <PostingEditTweetDesc
                    currentLight={isEditing === true && isDark === false && true}
                    currentDark={isEditing === true && isDark === true && true}
                    type="text"
                    value={editingTweet}
                    onChange={onChange}
                    maxlength="150"
                  ></PostingEditTweetDesc>
                  {tweetObject.fileDownloadUrl && <PostingTweetImage src={tweetObject.fileDownloadUrl} alt={tweetObject.content}></PostingTweetImage>}
                  <PostingTweetLike type="button" onClick={handleLikeBtn}>
                    <IconTweetLike icon={isHeart ? faHeart2 : faHeart}></IconTweetLike>
                    <IconTweetLikeNumber>{tweetObject.likesArray.length}</IconTweetLikeNumber>
                  </PostingTweetLike>
                </PostingTweetContent>
              </EditingTweetForm>
            </>
          )}
        </>
      ) : (
        <>
          <PostingTweetAuthorImage
            src={tweetObject.photoURL ? tweetObject.photoURL : userImage}
            onClick={!isOwner && (() => handlePostingTweet(tweetObject.uid))}
          ></PostingTweetAuthorImage>
          <PostingTweetContent>
            <PostingTweetAuthor>
              <AuthorInfo onClick={!isOwner && (() => handlePostingTweet(tweetObject.uid))}>
                <AuthorName>{tweetObject.displayName}</AuthorName>
                <AuthorEmail>{tweetObject.email}</AuthorEmail>
                <AuthorDot>·</AuthorDot>
                <AuthorCreatedAt>{getTime(tweetObject.createdAtTime)}</AuthorCreatedAt>
              </AuthorInfo>
              <PostingEditDelete>
                {isOwner && (
                  <>
                    <PostingTweetEdit type="button" onClick={onEditTweet}>
                      <IconTweetEdit icon={faEdit} current={isDark ? "true" : "false"}></IconTweetEdit>
                    </PostingTweetEdit>
                    <PostingTweetDelete type="button" onClick={onDeleteTweet}>
                      <IconTweetDelete icon={faTrashAlt} current={isDark ? "true" : "false"}></IconTweetDelete>
                    </PostingTweetDelete>
                  </>
                )}
              </PostingEditDelete>
            </PostingTweetAuthor>
            <PostingTweetDesc onClick={isOwner === true ? onEditTweet : handleNothing}>{tweetObject.content}</PostingTweetDesc>
            {tweetObject.fileDownloadUrl && (
              <PostingTweetImage src={tweetObject.fileDownloadUrl} alt={tweetObject.content} onClick={handleOpenModal}></PostingTweetImage>
            )}

            <IconSVGContainer>
              <IconHeartContainer>
                {isHeart ? (
                  <IconSVG
                    current={isDark ? "true" : "false"}
                    onClick={handleLikeBtn}
                    style={{ fill: "#f91880" }}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
                  >
                    <IconG>
                      <IconPath d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></IconPath>
                    </IconG>
                  </IconSVG>
                ) : (
                  <IconSVG
                    current={isDark ? "true" : "false"}
                    onClick={handleLikeBtn}
                    style={{ fill: "#f91880" }}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
                  >
                    <IconG>
                      <IconPath d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></IconPath>
                    </IconG>
                  </IconSVG>
                )}
                <IconTweetLikeNumber>{tweetObject.likesArray.length}</IconTweetLikeNumber>
              </IconHeartContainer>
              <IconSVG
                current={isDark ? "true" : "false"}
                style={{ fill: "#00cec9" }}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
              >
                <IconG>
                  <IconPath d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></IconPath>
                </IconG>
              </IconSVG>
              <IconSVG
                current={isDark ? "true" : "false"}
                style={{ fill: "#74b9ff" }}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
              >
                <IconG>
                  <IconPath d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></IconPath>
                </IconG>
              </IconSVG>
              <IconSVG
                current={isDark ? "true" : "false"}
                style={{ fill: "#b2bec3" }}
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
              >
                <IconG>
                  <IconPath d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></IconPath>
                  <IconPath d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></IconPath>
                </IconG>
              </IconSVG>
            </IconSVGContainer>
          </PostingTweetContent>
        </>
      )}

      {/* 팔로워 폼 */}
      {isFollower ? (
        <LoginFormContainer current={isDark ? "true" : "false"}>
          <LoginFormContent>
            <CloseButton current={isDark ? "true" : "false"} icon={faTimes} type="button" onClick={handleCloseFollower}></CloseButton>
            <PostingTweetFollowerContainer>
              <PostingTweetTitle>
                {isSearchTweetAuthor && isSearchTweetAuthor}님이 작성한 트윗 ({searchTweetLength})
              </PostingTweetTitle>
              {searchTweet &&
                searchTweet.map((tweetObject) => (
                  <PostingTweetFollower>
                    <PostingTweetAuthorImage src={tweetObject.photoURL ? tweetObject.photoURL : userImage}></PostingTweetAuthorImage>
                    <PostingTweetContent>
                      <PostingTweetAuthor>
                        <AuthorInfo>
                          <AuthorName>{tweetObject.displayName}</AuthorName>
                          <AuthorEmail>{tweetObject.email}</AuthorEmail>
                          <AuthorDot>·</AuthorDot>
                          <AuthorCreatedAt>{getTime(tweetObject.createdAtTime)}</AuthorCreatedAt>
                        </AuthorInfo>
                      </PostingTweetAuthor>
                      <PostingTweetDesc>{tweetObject.content}</PostingTweetDesc>
                      {tweetObject.fileDownloadUrl && <PostingTweetImage src={tweetObject.fileDownloadUrl} alt={tweetObject.content}></PostingTweetImage>}

                      <IconSVGContainer>
                        <IconHeartContainer>
                          <IconSVG
                            current={isDark ? "true" : "false"}
                            style={{ fill: "#f91880" }}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
                          >
                            <IconG>
                              <IconPath d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></IconPath>
                            </IconG>
                          </IconSVG>
                          <IconTweetLikeNumber>{tweetObject.likesArray.length}</IconTweetLikeNumber>
                        </IconHeartContainer>
                        <IconSVG
                          current={isDark ? "true" : "false"}
                          style={{ fill: "#00cec9" }}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
                        >
                          <IconG>
                            <IconPath d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></IconPath>
                          </IconG>
                        </IconSVG>
                        <IconSVG
                          current={isDark ? "true" : "false"}
                          style={{ fill: "#74b9ff" }}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
                        >
                          <IconG>
                            <IconPath d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></IconPath>
                          </IconG>
                        </IconSVG>
                        <IconSVG
                          current={isDark ? "true" : "false"}
                          style={{ fill: "#b2bec3" }}
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
                        >
                          <IconG>
                            <IconPath d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></IconPath>
                            <IconPath d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></IconPath>
                          </IconG>
                        </IconSVG>
                      </IconSVGContainer>
                    </PostingTweetContent>
                  </PostingTweetFollower>
                ))}
            </PostingTweetFollowerContainer>
          </LoginFormContent>
        </LoginFormContainer>
      ) : null}

      <ModalContainer isOpen={modalIsOpen} onAfterOpen={handleAfterOpenModal} onRequestClose={handleCloseModal} contentLabel="TweetImage Modal">
        <ModalImage src={modalImageSrc && modalImageSrc}></ModalImage>
        <ModalCloseButton icon={faTimes} type="button" onClick={handleCloseModal}></ModalCloseButton>
      </ModalContainer>
    </PostingTweetContainer>
  );
};

Tweet.propTypes = {
  userObject: PropTypes.object,
  tweetObject: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
  createNotification: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export default Tweet;
