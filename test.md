Home.js

import { useEffect, useState } from "react";
import { firestoreService } from "firebaseConfiguration";
import styled from "styled-components";
import Tweet from "components/Tweet";
import TweetForm from "components/TweetForm";

const Container = styled.div` border: 3px solid red;`;
const LeftContainer = styled.div` border: 3px solid blue;`;
const MenuContainer = styled.div``;

const UserContainer = styled.div``;

const CenterContainer = styled.div` border: 3px solid green;`;

const ContentContainer = styled.div``;

const RightContainer = styled.div` border: 3px solid orange;`;

const RegisterContainer = styled.div``;

const TrendContainer = styled.div``;

const FollowContainer = styled.div``;

const PolicyContainer = styled.div``;

const Home = ({ userObject, changeTheme }) => {
console.log("Home userObject", userObject);

const [allTweets, setAllTweets] = useState("");
const [allTweetsLength, setAllTweetsLength] = useState(0);
const [isDesc, setIsDesc] = useState(true);
const [searchText, setSearchText] = useState("");

const handleOrderBy = async () => {
await firestoreService
.collection("tweets")
.orderBy("createdAtTime", `${isDesc ? "asc" : "desc"}`)
.onSnapshot((querySnapshot) => {
const querySnapshotSize = querySnapshot.size;
const queryDocumentSnapshotObjectArray = querySnapshot.docs.map((queryDocumentSnapshot) => ({
documentId: queryDocumentSnapshot.id,
...queryDocumentSnapshot.data(),
}));

        setAllTweetsLength(querySnapshotSize);
        setAllTweets(queryDocumentSnapshotObjectArray);
      });
    setIsDesc(!isDesc);

};

const shareTwitter = () => {
var sendText = "노마드코더";
var sendUrl = "https://nomadcoders.co/";
window.open(`https://twitter.com/intent/tweet?text=${sendText}\&url\=${sendUrl}`);
};

const onSearchSubmit = (event) => {
event.preventDefault();
window.open(`https://twitter.com/search?q=${searchText}&src=typed_query`);
setSearchText("");
};

const onSearchInput = (event) => {
const {
target: { value },
} = event;
setSearchText(value);
};

useEffect(() => {
firestoreService
.collection("tweets")
.orderBy("createdAtTime", "desc")
.onSnapshot((querySnapshot) => {
const querySnapshotSize = querySnapshot.size;
const queryDocumentSnapshotObjectArray = querySnapshot.docs.map((queryDocumentSnapshot) => ({
// 전체 트윗 가져오기 (map사용)
documentId: queryDocumentSnapshot.id,
...queryDocumentSnapshot.data(),
}));
setAllTweetsLength(querySnapshotSize);
setAllTweets(queryDocumentSnapshotObjectArray);
});
}, []);

return (
<>
<Container>
<LeftContainer>
<MenuContainer></MenuContainer>
<UserContainer></UserContainer>
</LeftContainer>
<CenterContainer>
<ContentContainer></ContentContainer>
</CenterContainer>
<RightContainer>
<RegisterContainer></RegisterContainer>
<TrendContainer></TrendContainer>
<FollowContainer></FollowContainer>
<PolicyContainer></PolicyContainer>
</RightContainer>
</Container>
<h1>Home</h1>
<form onSubmit={onSearchSubmit}>
<input type="text" placeholder="트위터 검색" onChange={onSearchInput} value={searchText}></input>
</form>
<button onClick={changeTheme}>모드 전환</button>
<button onClick={handleOrderBy}>{isDesc ? "오래된순" : "최신순"}</button>
<button onClick={shareTwitter}>트위터에 공유하기</button>
<TweetForm userObject={userObject}></TweetForm>
<h1>전체 트윗 갯수: {allTweetsLength}</h1>
<div>
{allTweets &&
allTweets.map((tweetObject) => {
return <Tweet key={tweetObject.id} userObject={userObject} tweetObject={tweetObject} isOwner={userObject.uid === tweetObject.uid ? true : false} />;
})}
</div>
</>
);
};

export default Home;
