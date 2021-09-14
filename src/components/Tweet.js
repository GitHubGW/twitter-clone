import { useState } from "react";
import PropTypes from "prop-types";
import { firestoreService, storageService } from "firebaseConfiguration";

const Tweet = ({ userObject, tweetObject, isOwner }) => {
  // userObject는 현재 로그인한 유저, tweetObject는 해당 트윗을 작성한 유저
  console.log("Tweet.js tweetObject", tweetObject);
  console.log("Tweet.js userObject", userObject);

  const [isEditing, setIsEditing] = useState(false); // 트윗을 현재 수정중인지 여부 체크
  const [editingTweet, setEditingTweet] = useState(tweetObject.content); // 수정 중인 트윗 내용을 가져옴
  const [isLike, setIsLike] = useState(false); // 좋아요 눌렀는지 체크(Local)

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
    } else if (isLike === true) {
      const filteredLikesArray = totalLikesArray.filter((value, index) => {
        return value !== userObject.email;
      });

      await firestoreService.collection("tweets").doc(`${tweetObject.documentId}`).update({
        likesArray: filteredLikesArray,
        clickLikes: false,
      });
    }
    setIsLike(!isLike);
  };

  return (
    <div>
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
          {console.log("문서", tweetObject)}
          {tweetObject.fileDownloadUrl && <img style={{ width: "250px", height: "200px" }} src={tweetObject.fileDownloadUrl} alt={tweetObject.content} />}
          <h3>{tweetObject.content}</h3>
          <h4>{tweetObject.createdAtDate}</h4>
          <button onClick={handleLikeBtn}>좋아요{tweetObject.likesArray.length}</button>
          {isOwner && (
            <>
              <button onClick={onEditTweet}>트윗 수정</button>
              <button onClick={onDeleteTweet}>트윗 삭제</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

Tweet.propTypes = {
  isOwner: PropTypes.bool.isRequired,
};

export default Tweet;
