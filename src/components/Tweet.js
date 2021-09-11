import { useState } from "react";
import PropTypes from "prop-types";
import { firestoreService } from "firebaseConfiguration";

const Tweet = ({ tweetObject, isOwner }) => {
  console.log("tweetObject", tweetObject);

  const [isEditing, setIsEditing] = useState(false); // 트윗을 현재 수정중인지 여부 체크
  const [editingTweet, setEditingTweet] = useState(tweetObject.content); // 수정 중인 트윗 내용을 가져옴
  const FIRESTORE_COLLECTION = "tweets";

  const onSubmit = async (event) => {
    event.preventDefault();

    await firestoreService.collection(FIRESTORE_COLLECTION).doc(`${tweetObject.documentId}`).update({
      content: editingTweet,
    });
    setEditingTweet("");
    setIsEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setEditingTweet(value);
  };

  const onEditTweet = () => {
    setIsEditing(true);
  };

  const onDeleteTweet = async () => {
    const booleanDeleteTweet = window.confirm("트윗을 삭제하시겠습니까?");

    if (booleanDeleteTweet) {
      // await firestoreService.doc(`${FIRESTORE_COLLECTION}/${tweetObject.documentId}`).delete();
      await firestoreService.collection(FIRESTORE_COLLECTION).doc(`${tweetObject.documentId}`).delete();
    }
  };

  const onCancelTweet = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input type="text" placeholder="트윗 수정" value={editingTweet} onChange={onChange}></input>
                <input type="submit" value="업데이트" onClick={onSubmit}></input>
              </form>
              <button onClick={onCancelTweet}>취소</button>
            </>
          )}
        </>
      ) : (
        <>
          {tweetObject.fileDownloadUrl && <img style={{ width: "250px", height: "200px" }} src={tweetObject.fileDownloadUrl} alt={tweetObject.content} />}
          <h3>{tweetObject.content}</h3>
          <h4>{tweetObject.createdAtDate}</h4>
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

Tweet.propTypes = {};

export default Tweet;
