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

const PostingTweetAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
`;

const PostingEditDelete = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorName = styled.h2`
  font-size: 18px;
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
`;

const PostingTweetEdit = styled.button``;

const PostingTweetDelete = styled.button``;

const IconTweetLike = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 17px;
  color: #f91880;
`;

const IconTweetLikeNumber = styled.span`
  color: #f91880;
  margin-left: 5px;
  font-size: 15px;
  font-weight: 500;
`;

const IconTweetEdit = styled(FontAwesomeIcon)`
  cursor: pointer;
  font-size: 20px;
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
  font-size: 20px;
  color: gray;
  padding: 10px;
  border-radius: 50%;

  &:hover {
    color: var(--twitter-color);
    background-color: #e6f3ff;
  }
`;

const Tweet = ({ userObject, tweetObject, isOwner }) => {
  // userObject는 현재 로그인한 유저, tweetObject는 해당 트윗을 작성한 유저
  // console.log("Tweet.js tweetObject", tweetObject);
  // console.log("Tweet.js userObject", userObject);

  const [isEditing, setIsEditing] = useState(false); // 트윗을 현재 수정중인지 여부 체크
  const [editingTweet, setEditingTweet] = useState(tweetObject.content); // 수정 중인 트윗 내용을 가져옴
  const [isLike, setIsLike] = useState(false); // 좋아요 눌렀는지 체크(Local)
  const [isHeart, setIsHeart] = useState(tweetObject.likesArray.includes(userObject.email)); // 좋아요 눌렀는지 체크(DB)

  const getTime = (time) => {
    const now = parseInt(time);
    const date = new Date(now);
    const day = ["일", "월", "화", "수", "목", "금", "토"];
    const getFullYear = date.getFullYear();
    const getMonth = date.getMonth() + 1;
    const getDate = date.getDate();
    const getDay = day[date.getDay()];
    const getHours = date.getHours();
    const getMinutes = date.getMinutes();
    return `${getMonth}월 ${getDate}일 (${getDay})`;
  };

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

  const onEditTweet = () => {
    setIsEditing(true);
    setEditingTweet(tweetObject.content);
  };

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

  const onCancelTweet = () => {
    setEditingTweet(editingTweet);
    setIsEditing(false);
  };

  const handleLikeBtn = async () => {
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

  return (
    <PostingTweetContainer>
      {isEditing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input type="text" placeholder="트윗 수정" value={editingTweet} onChange={onChange}></input>
                <input type="submit" value="업데이트"></input>
              </form>
              <button onClick={onCancelTweet}>취소</button>
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
            <PostingTweetDesc>{tweetObject.content}</PostingTweetDesc>
            {tweetObject.fileDownloadUrl && <PostingTweetImage src={tweetObject.fileDownloadUrl} alt={tweetObject.content}></PostingTweetImage>}
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
