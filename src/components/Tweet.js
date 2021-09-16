import { useState } from "react";
import PropTypes from "prop-types";
import { firestoreService, storageService } from "firebaseConfiguration";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeart2 } from "@fortawesome/free-solid-svg-icons";
import { faEdit, faHeart, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import userImage from "images/user.png";

const PostingTweetContainer = styled.div`
  display: flex;
  padding: 10px 17px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  background-color: ${(props) => props.current && "#f8f8f8"};

  &:hover {
    background-color: #f8f8f8;
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

const EditingTweetForm = styled.form`
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

const PostingEditDelete = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorName = styled.h2`
  font-size: 17px;
  font-weight: bold;
`;

const AuthorEmail = styled.h3`
  font-size: 16px;
  margin-left: 7px;
  color: gray;
  font-weight: 500;
`;

const AuthorCreatedAt = styled.h4`
  font-size: 14px;
  color: gray;
  font-weight: 500;
`;

const AuthorDot = styled.span`
  font-size: 15px;
  margin: 0 5px;
`;

const PostingTweetDesc = styled.p`
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 1.5;
  margin-top: 8px;
`;

const PostingEditTweetDesc = styled.input`
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 1.5;
  border: none;
  outline: none;
  width: 100%;
  background-color: white;
  padding: 12px 12px;
  box-sizing: border-box;
  margin-top: 8px;
  color: gray;
`;

const PostingTweetImage = styled.img`
  width: 480px;
  height: 280px;
  border-radius: 15px;
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
`;

const IconTweetLikeNumber = styled.span`
  color: #f91880;
  font-size: 15px;
  font-weight: 500;
`;

const IconTweetEdit = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 18px;
  color: gray;
  padding: 10px;
  border-radius: 50%;

  &:hover {
    color: var(--twitter-color);
    background-color: #e6f3ff;
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
    background-color: #e6f3ff;
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

const Tweet = ({ userObject, tweetObject, isOwner, createNotification }) => {
  // userObject는 현재 로그인한 유저, tweetObject는 해당 트윗을 작성한 유저
  // console.log("Tweet.js tweetObject", tweetObject);
  // console.log("Tweet.js userObject", userObject);

  const [isEditing, setIsEditing] = useState(false); // 현재 트윗을 수정 중인지 확인
  const [editingTweet, setEditingTweet] = useState(tweetObject.content); // 수정 중인 트윗 내용을 가져옴
  const [isLike, setIsLike] = useState(false); // 좋아요를 눌렀는지 체크(Local)
  const [isHeart, setIsHeart] = useState(tweetObject.likesArray.includes(userObject?.email)); // 좋아요를 눌렀는지 체크(DB)

  const getTime = (time) => {
    const now = parseInt(time);
    const date = new Date(now);
    const day = ["일", "월", "화", "수", "목", "금", "토"];
    const getMonth = date.getMonth() + 1;
    const getDate = date.getDate();
    const getDay = day[date.getDay()];
    return `${getMonth}월 ${getDate}일 (${getDay})`;
  };

  // 트윗 작성 및 수정 버튼
  const onSubmit = async (event) => {
    event.preventDefault();

    await firestoreService.collection("tweets").doc(`${tweetObject.documentId}`).update({
      content: editingTweet,
    });
    setIsEditing(false);
    // setEditingTweet("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setEditingTweet(value);
  };

  // 트윗 수정 버튼 (아이콘)
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

  const onClickPostingImage = (event) => {
    const {
      target: { src },
    } = event;

    if (src) {
      window.open(src);
    }
  };

  const handleNothing = () => {};

  return (
    <PostingTweetContainer current={isEditing ? true : false}>
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
                          <EditTweetBtn onClick={onSubmit}>수정</EditTweetBtn>
                          <DeleteTweetBtn onClick={onCancelTweet}>취소</DeleteTweetBtn>
                        </>
                      )}
                    </PostingEditDelete>
                  </PostingTweetAuthor>
                  <PostingEditTweetDesc type="text" value={editingTweet} onChange={onChange}></PostingEditTweetDesc>
                  {tweetObject.fileDownloadUrl && <PostingTweetImage src={tweetObject.fileDownloadUrl} alt={tweetObject.content}></PostingTweetImage>}
                  <PostingTweetLike onClick={handleLikeBtn}>
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
          <PostingTweetAuthorImage src={tweetObject.photoURL ? tweetObject.photoURL : userImage}></PostingTweetAuthorImage>
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
                    <PostingTweetEdit onClick={onEditTweet}>
                      <IconTweetEdit icon={faEdit}></IconTweetEdit>
                    </PostingTweetEdit>
                    <PostingTweetDelete onClick={onDeleteTweet}>
                      <IconTweetDelete icon={faTrashAlt}></IconTweetDelete>
                    </PostingTweetDelete>
                  </>
                )}
              </PostingEditDelete>
            </PostingTweetAuthor>
            <PostingTweetDesc onClick={isOwner === true ? onEditTweet : handleNothing}>{tweetObject.content}</PostingTweetDesc>
            {tweetObject.fileDownloadUrl && (
              <PostingTweetImage
                src={tweetObject.fileDownloadUrl}
                alt={tweetObject.content}
                onClick={isOwner ? handleNothing : onClickPostingImage}
              ></PostingTweetImage>
            )}
            <PostingTweetLike onClick={handleLikeBtn}>
              <IconTweetLike icon={isHeart ? faHeart2 : faHeart}></IconTweetLike>
              <IconTweetLikeNumber>{tweetObject.likesArray.length}</IconTweetLikeNumber>
            </PostingTweetLike>
          </PostingTweetContent>
        </>
      )}
    </PostingTweetContainer>
  );
};

Tweet.propTypes = {
  isOwner: PropTypes.bool.isRequired,
};

export default Tweet;
