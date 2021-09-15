import { useRef, useState } from "react";
import { authService, firestoreService, storageService } from "firebaseConfiguration";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import {} from "@fortawesome/free-brands-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import userImage from "images/user.png";

const TweetFormContainer = styled.form`
  height: 100%;
`;

const TweetFormTextContainer = styled.div`
  height: 150px;
`;

const TweetFormTextInput = styled.input`
  width: 100%;
  padding-bottom: 150px;
  border: none;
  outline: none;
  padding: 12px 0px;
  box-sizing: border-box;
  border: 3px solid red;
  font-size: 18px;

  &::placeholder {
    color: gray;
  }
`;

const TweetFormImageInput = styled.input``;

const TweetFormImageContainer = styled.div``;

const TweetFormImageLabel = styled.label``;

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
`;

const IconTweetFormContainer = styled(FontAwesomeIcon)`
  font-size: 35px;
  cursor: pointer;
  color: gray;
`;

const TweetForm = ({ userObject }) => {
  const [tweet, setTweet] = useState("");
  const [fileDataUrl, setFileDataUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const fileImageInput = useRef();
  const textInput = useRef();
  const inputTweet = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();

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
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const uploadFile = files[0];
    const uploadFileName = uploadFile?.name;
    const fileReader = new FileReader();

    if (fileReader && uploadFile !== undefined && uploadFile !== null) {
      console.log("TweetForm uploadFile", uploadFile);
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

  const onCancelClick = () => {
    setFileDataUrl("");
    setTweet("");
    fileImageInput.current.value = "";
  };

  return (
    <TweetFormContainer onSubmit={onSubmit}>
      <TweetFormTextContainer>
        <TweetFormTextInput
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
      </TweetFormTextContainer>

      <TweetFormImageContainer>
        <TweetFormImageLabel for="fileUploadBtn">
          <IconTweetFormContainer icon={faImage}></IconTweetFormContainer>
        </TweetFormImageLabel>
        <TweetFormSubmit type="submit" value="트윗하기" ref={inputTweet}></TweetFormSubmit>
      </TweetFormImageContainer>

      {fileDataUrl && (
        <div>
          <img src={fileDataUrl} alt="" style={{ width: "300px", height: "250px" }}></img>
          <button onClick={onCancelClick}>취소</button>
        </div>
      )}
    </TweetFormContainer>
  );
};

export default TweetForm;
