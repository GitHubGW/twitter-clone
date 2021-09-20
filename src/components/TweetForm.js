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
  margin-top: 10px;
`;

const TweetFormImageLabel = styled.label`
  margin-top: 4px;
`;

const IconTweetSmileContainer = styled.div`
  position: relative;
`;

const IconSVG = styled.svg`
  fill: #bebebe;
  height: 21px;
  cursor: pointer;
  border-radius: 50%;
  padding: 7px;

  &:hover {
    fill: ${(props) => (props.current === "true" ? "#1DA1F2" : "#bebebe")};
    background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#e6f3ff")};
  }
`;

const IconG = styled.g``;

const IconPath = styled.path``;

const IconCircle = styled.circle``;

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

// const IconTweetFormContainer = styled(FontAwesomeIcon)`
//   font-size: 30px;
//   cursor: pointer;
//   color: #bebebe;
//   padding: 7px;
//   border-radius: 50%;

//   &:hover {
//     color: var(--twitter-color);
//     background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#e6f3ff")};
//   }
// `;

// const IconTweetSmile = styled(FontAwesomeIcon)`
//   font-size: 20px;
//   cursor: pointer;
//   color: #bebebe;
//   padding: 7px;
//   border-radius: 50%;

//   &:hover {
//     color: var(--twitter-color);
//     background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#e6f3ff")};
//   }
// `;

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
          <IconSVG
            current={isDark ? "true" : "false"}
            viewBox="0 0 24 24"
            aria-hidden="true"
            class="r-1cvl2hr r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"
          >
            <IconG>
              <IconPath d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z"></IconPath>
              <IconCircle cx="8.868" cy="8.309" r="1.542"></IconCircle>
            </IconG>
          </IconSVG>
          {/* <IconTweetFormContainer icon={faImage} current={isDark ? "true" : "false"}></IconTweetFormContainer> */}
        </TweetFormImageLabel>

        {/* <IconTweetSmile icon={faSmile} onClick={onClickEmoji} current={isDark ? "true" : "false"}></IconTweetSmile> */}
        <IconSVG
          onClick={onClickEmoji}
          current={isDark ? "true" : "false"}
          style={{ height: "20px" }}
          viewBox="0 0 24 24"
          aria-hidden="true"
          class="r-1cvl2hr r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"
        >
          <IconG>
            <IconPath d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z"></IconPath>
            <IconPath d="M12 17.115c-1.892 0-3.633-.95-4.656-2.544-.224-.348-.123-.81.226-1.035.348-.226.812-.124 1.036.226.747 1.162 2.016 1.855 3.395 1.855s2.648-.693 3.396-1.854c.224-.35.688-.45 1.036-.225.35.224.45.688.226 1.036-1.025 1.594-2.766 2.545-4.658 2.545z"></IconPath>
            <IconCircle cx="14.738" cy="9.458" r="1.478"></IconCircle>
            <IconCircle cx="9.262" cy="9.458" r="1.478"></IconCircle>
          </IconG>
        </IconSVG>
        {isEmoji ? <PickerContainer onEmojiClick={onEmojiClick} disableSearchBar={true} /> : null}

        <IconSVG
          current={isDark ? "true" : "false"}
          style={{ height: "20px" }}
          viewBox="0 0 24 24"
          aria-hidden="true"
          class="r-1cvl2hr r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"
        >
          <IconG>
            <IconPath d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2z"></IconPath>
            <IconPath d="M-37.9 18c-.1-.1-.1-.1-.1-.2.1 0 .1.1.1.2zM18 2.2h-1.3v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H7.7v-.3c0-.4-.3-.8-.8-.8-.4 0-.8.3-.8.8v.3H4.8c-1.4 0-2.5 1.1-2.5 2.5v13.1c0 1.4 1.1 2.5 2.5 2.5h2.9c.4 0 .8-.3.8-.8 0-.4-.3-.8-.8-.8H4.8c-.6 0-1-.5-1-1V7.9c0-.3.4-.7 1-.7H18c.6 0 1 .4 1 .7v1.8c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-5c-.1-1.4-1.2-2.5-2.6-2.5zm1 3.7c-.3-.1-.7-.2-1-.2H4.8c-.4 0-.7.1-1 .2V4.7c0-.6.5-1 1-1h1.3v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5h7.5v.5c0 .4.3.8.8.8.4 0 .8-.3.8-.8v-.5H18c.6 0 1 .5 1 1v1.2z"></IconPath>
            <IconPath d="M15.5 10.4c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2 3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2zm0 11c-2.6 0-4.7-2.1-4.7-4.7s2.1-4.7 4.7-4.7 4.7 2.1 4.7 4.7c0 2.5-2.1 4.7-4.7 4.7z"></IconPath>
            <IconPath d="M18.9 18.7c-.1.2-.4.4-.6.4-.1 0-.3 0-.4-.1l-3.1-2v-3c0-.4.3-.8.8-.8.4 0 .8.3.8.8v2.2l2.4 1.5c.2.2.3.6.1 1z"></IconPath>
          </IconG>
        </IconSVG>

        <IconSVG
          current={isDark ? "true" : "false"}
          viewBox="0 0 24 24"
          aria-hidden="true"
          class="r-1cvl2hr r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"
        >
          <IconG>
            <IconPath d="M20.222 9.16h-1.334c.015-.09.028-.182.028-.277V6.57c0-.98-.797-1.777-1.778-1.777H3.5V3.358c0-.414-.336-.75-.75-.75s-.75.336-.75.75V20.83c0 .415.336.75.75.75s.75-.335.75-.75v-1.434h10.556c.98 0 1.778-.797 1.778-1.777v-2.313c0-.095-.014-.187-.028-.278h4.417c.98 0 1.778-.798 1.778-1.778v-2.31c0-.983-.797-1.78-1.778-1.78zM17.14 6.293c.152 0 .277.124.277.277v2.31c0 .154-.125.28-.278.28H3.5V6.29h13.64zm-2.807 9.014v2.312c0 .153-.125.277-.278.277H3.5v-2.868h10.556c.153 0 .277.126.277.28zM20.5 13.25c0 .153-.125.277-.278.277H3.5V10.66h16.722c.153 0 .278.124.278.277v2.313z"></IconPath>
          </IconG>
        </IconSVG>

        <IconSVG
          current={isDark ? "true" : "false"}
          viewBox="0 0 24 24"
          aria-hidden="true"
          class="r-1cvl2hr r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"
        >
          <IconG>
            <IconPath d="M19 10.5V8.8h-4.4v6.4h1.7v-2h2v-1.7h-2v-1H19zm-7.3-1.7h1.7v6.4h-1.7V8.8zm-3.6 1.6c.4 0 .9.2 1.2.5l1.2-1C9.9 9.2 9 8.8 8.1 8.8c-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1 0 1.8-.4 2.4-1.1v-2.5H7.7v1.2h1.2v.6c-.2.1-.5.2-.8.2-.9 0-1.6-.7-1.6-1.6 0-.8.7-1.6 1.6-1.6z"></IconPath>
            <IconPath d="M20.5 2.02h-17c-1.24 0-2.25 1.007-2.25 2.247v15.507c0 1.238 1.01 2.246 2.25 2.246h17c1.24 0 2.25-1.008 2.25-2.246V4.267c0-1.24-1.01-2.247-2.25-2.247zm.75 17.754c0 .41-.336.746-.75.746h-17c-.414 0-.75-.336-.75-.746V4.267c0-.412.336-.747.75-.747h17c.414 0 .75.335.75.747v15.507z"></IconPath>
          </IconG>
        </IconSVG>

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
