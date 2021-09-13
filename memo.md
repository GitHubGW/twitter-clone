### 버그 및 오류 해결

- [x] 이미지 트윗 작성 후, 트윗 작성 버튼이 아닌 엔터를 눌렀을 때 트윗이 되지 않는 문제 수정완료
- [x] 이미지 트윗 작성 후, 업로드했을 때 이미지 파일명을 불러오지 못하는 문제 수정완료
- [x] 소셜 로그인이 아닌 이메일로 가입 후, 로그인했을 때 기본 displayName이 설정 되어 있지 않아 뜨는 문제 수정완료
- [x] 이미지 파일 선택후 다시 취소하고 눌렀을 때 FileReader가 readAsDataURL을 실행하지 못하는 문제 수정완료
- [x] 트윗 수정을 눌렀을 때 현재 트윗이 아닌 이전 트윗의 내용이 뜨던 문제 수정완료
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]
- [ ]

## Code

### Home.js

```
import { useEffect, useState } from "react";
import { firestoreService } from "firebaseConfiguration";
import Tweet from "components/Tweet";
import TweetForm from "components/TweetForm";

const Home = ({ userObject }) => {
  const [allTweets, setAllTweets] = useState("");
  const [allTweetsLength, setAllTweetsLength] = useState(0);

  /*
  // 방법1: 전체 트윗 가져오기
  const getTweets = async () => {
    const querySnapshot = await firestoreService.collection("tweets").get();
    querySnapshot.forEach((queryDocumentSnapshot) => {
      const queryDocumentSnapshotObject = {
        id: queryDocumentSnapshot.id,
        ...queryDocumentSnapshot.data(),
      };

      setAllTweets((allTweets) => {
        return [queryDocumentSnapshotObject, ...allTweets];
      });
    });
  };
  */

  useEffect(() => {
    // getTweets();

    firestoreService
      .collection("tweets")
      .orderBy("createdAtTime", "desc")
      .onSnapshot((querySnapshot) => {
        const querySnapshotSize = querySnapshot.size;
        setAllTweetsLength(querySnapshotSize);

        /*
        // 방법2: 전체 트윗 가져오기 (forEach사용)
        querySnapshot.forEach((queryDocumentSnapshot) => {
          const queryDocumentSnapshotObject = {
            id: queryDocumentSnapshot.id,
            ...queryDocumentSnapshot.data(),
          };

          setAllTweets((allTweets) => {
            return [queryDocumentSnapshotObject, ...allTweets];
          });
        });
        */

        // 방법3: 전체 트윗 가져오기 (map사용)
        const queryDocumentSnapshotObjectArray = querySnapshot.docs.map((queryDocumentSnapshot) => ({
          documentId: queryDocumentSnapshot.id,
          ...queryDocumentSnapshot.data(),
        }));

        setAllTweets(queryDocumentSnapshotObjectArray);
      });
  }, []);

  return (
    <>
      <h1>Home</h1>
      <TweetForm userObject={userObject}></TweetForm>
      <h1>전체 트윗 갯수: {allTweetsLength}</h1>
      <div>
        {allTweets &&
          allTweets.map((tweetObject) => {
            return <Tweet key={tweetObject.id} tweetObject={tweetObject} isOwner={userObject.uid === tweetObject.uid ? true : false} />;
          })}
      </div>
    </>
  );
};

export default Home;
```
