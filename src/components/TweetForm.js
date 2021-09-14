import { useRef, useState } from "react";
import { authService, firestoreService, storageService } from "firebaseConfiguration";

const TweetForm = ({ userObject }) => {
  const [tweet, setTweet] = useState("");
  const [fileDataUrl, setFileDataUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const fileImageInput = useRef();
  const textInput = useRef();

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
    <>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="트윗 입력" value={tweet} onChange={onChange} maxLength={100} ref={textInput} required />
        <input type="file" accept="image/*" onChange={onFileChange} ref={fileImageInput} />
        <input type="submit" value="트윗 작성" />
        {fileDataUrl && (
          <div>
            <img src={fileDataUrl} alt="" style={{ width: "300px", height: "250px" }}></img>
            <button onClick={onCancelClick}>취소</button>
          </div>
        )}
      </form>
    </>
  );
};

export default TweetForm;
