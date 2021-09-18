import { useRef, useState } from "react";
import { authService, firestoreService, storageService } from "firebaseConfiguration";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faImage, faSmile } from "@fortawesome/free-regular-svg-icons";
import Picker from "emoji-picker-react";

const TweetFormContainer = styled.form``;

const TweetFormTextContainer = styled.div`
  position: relative;
`;

const TweetFormTextInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  padding: 12px 0px;
  padding-left: 4px;
  padding-right: 30px;
  padding-bottom: 18px;
  margin-bottom: 15px;
  box-sizing: border-box;
  font-size: 18px;
  border-radius: 4px;
  color: #989898;
  background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#f8f8f8")};

  &::placeholder {
    color: #989898;
  }
`;

const TweetFormImageInput = styled.input``;

const FileDataContainer = styled.div`
  position: relative;
`;

const FileData = styled.img`
  width: 490px;
  height: 280px;
  border-radius: 15px;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const FileDataButton = styled.button``;

const IconDataCancelContainer = styled(FontAwesomeIcon)`
  position: absolute;
  top: 5px;
  left: 6px;
  font-size: 17px;
  padding: 7px 9px;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
`;

const TweetFormImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
`;

const TweetFormImageLabel = styled.label``;

const IconTweetSmileContainer = styled.div`
  position: relative;
`;

const TweetFormSubmit = styled.input`
  border: none;
  outline: none;
  cursor: pointer;
  padding: 10px 15px;
  color: white;
  border-radius: 30px;
  font-size: 15px;
  font-weight: bold;
  background-color: #98cff8;
  margin-left: auto;
`;

const IconTweetFormContainer = styled(FontAwesomeIcon)`
  font-size: 25px;
  cursor: pointer;
  color: #bebebe;
  padding: 7px;
  border-radius: 50%;

  &:hover {
    color: var(--twitter-color);
    background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#e6f3ff")};
  }
`;

const IconTweetSmile = styled(FontAwesomeIcon)`
  font-size: 25px;
  cursor: pointer;
  color: #bebebe;
  padding: 7px;
  border-radius: 50%;

  &:hover {
    color: var(--twitter-color);
    background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#e6f3ff")};
  }
`;

const PickerContainer = styled(Picker)``;

const TweetForm = ({ userObject, createNotification, isDark }) => {
  const [tweet, setTweet] = useState("");
  const [fileDataUrl, setFileDataUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const fileImageInput = useRef();
  const textInput = useRef();
  const inputTweet = useRef();
  const [isEmoji, setIsEmoji] = useState(false);

  // 트윗하기 버튼
  const onSubmit = async (event) => {
    event.preventDefault();

    if (userObject === null) {
      createNotification("NotLogin");
      return;
    }

    let fileDownloadUrl = "";
    const currentUserObject = authService.currentUser;

    if (fileDataUrl !== "") {
      // 1. 파일이 업로드되서 저장될 버킷 내부의 래퍼런스 경로를 생성
      const fileReference = storageService.ref().child(`${userObject.email}/tweet/${fileName}`);

      // 2. 파일 데이터를 버킷 내부의 래퍼런스 경로로 전달 (파일을 버킷에 업로드)
      const uploadTask = await fileReference.putString(fileDataUrl, "data_url");

      // 3. 버킷 내부의 래퍼런스에 있는 파일에 대한 DownloadURL을 받음
      fileDownloadUrl = await uploadTask.ref.getDownloadURL();
    }

    await firestoreService.collection("tweets").add({
      uid: currentUserObject.uid,
      displayName: currentUserObject.displayName,
      email: currentUserObject.email,
      emailVerified: currentUserObject.emailVerified,
      photoURL: currentUserObject.photoURL,
      creationTime: currentUserObject.metadata.a,
      lastSignInTime: currentUserObject.metadata.b,
      content: tweet,
      createdAtTime: Date.now(),
      createdAtDate: new Date().toLocaleDateString(),
      fileDownloadUrl,
      likesArray: [],
      clickLikes: false,
    });

    fileImageInput.current.value = "";
    setTweet("");
    setFileDataUrl("");
    setIsEmoji(false);
    createNotification("SuccessPostTweet");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    if (value) {
      inputTweet.current.style.backgroundColor = "#1DA1F2";
    } else {
      inputTweet.current.style.backgroundColor = "#98cff8";
    }

    setTweet(value);
    setIsEmoji(false);
  };

  // 파일 첨부 버튼
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const uploadFile = files[0];
    const uploadFileName = uploadFile?.name;
    const fileReader = new FileReader();

    if (fileReader && uploadFile !== undefined && uploadFile !== null) {
      // console.log("TweetForm uploadFile", uploadFile);

      fileReader.onload = (event) => {
        const {
          target: { result },
        } = event;

        setFileDataUrl(result);
      };

      fileReader.readAsDataURL(uploadFile);
      setFileName(`${uploadFileName}_${Date.now()}`);
    }
  };

  // 이미지 첨부 후 닫기 버튼
  const onCancelClick = () => {
    setFileDataUrl("");
    setTweet("");
    fileImageInput.current.value = "";
  };

  // input에 이모지 넣기
  const onEmojiClick = (event, emojiObject) => {
    const textInputValue = textInput.current.value;
    const inputValue = textInputValue + emojiObject.emoji;

    setTweet(inputValue);
  };

  // 이모지 버튼 클릭
  const onClickEmoji = () => {
    setIsEmoji(!isEmoji);
  };

  return (
    <TweetFormContainer onSubmit={onSubmit}>
      <TweetFormTextContainer>
        <TweetFormTextInput
          current={isDark ? "true" : "false"}
          type="text"
          placeholder="무슨 일이 일어나고 있나요?"
          value={tweet}
          onChange={onChange}
          maxLength={100}
          ref={textInput}
          required
        ></TweetFormTextInput>
        <TweetFormImageInput
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileImageInput}
          id="fileUploadBtn"
          style={{ display: "none" }}
        ></TweetFormImageInput>
        {fileDataUrl && (
          <FileDataContainer>
            <FileData src={fileDataUrl} alt="image"></FileData>
            <FileDataButton type="button" onClick={onCancelClick}>
              <IconDataCancelContainer icon={faTimes}></IconDataCancelContainer>
            </FileDataButton>
          </FileDataContainer>
        )}
      </TweetFormTextContainer>

      <TweetFormImageContainer>
        <TweetFormImageLabel htmlFor="fileUploadBtn">
          <IconTweetFormContainer icon={faImage} current={isDark ? "true" : "false"}></IconTweetFormContainer>
        </TweetFormImageLabel>
        <IconTweetSmileContainer>
          <IconTweetSmile icon={faSmile} onClick={onClickEmoji} current={isDark ? "true" : "false"}></IconTweetSmile>
          {isEmoji ? <PickerContainer onEmojiClick={onEmojiClick} disableSearchBar={true} /> : null}
        </IconTweetSmileContainer>
        <TweetFormSubmit type="submit" value="트윗하기" ref={inputTweet}></TweetFormSubmit>
      </TweetFormImageContainer>
    </TweetFormContainer>
  );
};

TweetForm.propTypes = {
  userObject: PropTypes.object,
  createNotification: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export default TweetForm;
