import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { firestoreService } from "firebaseConfiguration";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faHashtag, faEllipsisH, faCog } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faBell, faEnvelope, faBookmark, faListAlt, faUser } from "@fortawesome/free-regular-svg-icons";
import Tweet from "components/Tweet";
import TweetForm from "components/TweetForm";
import userImage from "images/user.png";

const Container = styled.div`
  border: 3px solid red;
  width: 1280px;
  max-width: 1280px;
  display: flex;
`;

const LeftContainer = styled.div`
  flex: 1;
  width: 280px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* position: fixed; */
  /* top: 0; */
  /* border: 5px solid red; */
`;

const MenuContainer = styled.div``;

const MenuImage = styled.div`
  margin-left: 5px;
  margin-bottom: 15px;
  border-radius: 50%;
  padding: 10px;
  display: inline-block;
  &:hover {
    background-color: #e6f3ff;
  }
`;

const IconTwitterContainer = styled(FontAwesomeIcon)`
  font-size: 30px;
  color: var(--twitter-color);
  cursor: pointer;
`;

const MenuNav = styled.ul``;

const MenuList = styled.li`
  margin-bottom: 8px;
  display: inline-block;
  margin-right: 50px;
  align-items: center;
  padding: 14px 15px;
  padding-right: 25px;
  border-radius: 50px;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    background-color: #eeeeee;
  }
`;

const IconContainer = styled(FontAwesomeIcon)`
  width: 30px !important;
  display: inline-block;
  font-size: 24px;
`;

const IconText = styled.span`
  display: inline-block;
  font-size: 20px;
  margin-left: 20px;
`;

const MenuButton = styled.button`
  margin-top: 15px;
  padding: 17px 90px;
  background-color: var(--twitter-color);
  color: white;
  border-radius: 30px;
  font-size: 17px;
  font-weight: bold;

  &:hover {
    background-color: var(--twitter-dark-color);
  }
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 50px;
  padding: 12px 10px;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #eeeeee;
  }
`;

const UserPhoto = styled.img`
  flex: 1;
  width: 46px;
  height: 46px;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  flex: 8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 12px;
`;

const UserName = styled.div`
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 5px;
`;

const UserEmail = styled.div`
  font-size: 17px;
  color: #444444;
`;

const IconUserEtcContainer = styled(FontAwesomeIcon)`
  flex: 1;
  font-size: 18px;
  cursor: pointer;
  padding-right: 10px;
`;

const CenterContainer = styled.div`
  border: 3px solid green;
  flex: 2.5;
`;

const ContentContainer = styled.div``;

const RightContainer = styled.div`
  border: 3px solid orange;
  flex: 1.3;
`;

const RegisterContainer = styled.div`
  border: 3px solid blue;
`;

const TrendContainer = styled.div`
  border: 3px solid red;
  background-color: #f0f2f2;
`;

const TrendHeader = styled.div``;

const TrendHeaderTitle = styled.h1`
  font-size: 25px;
`;

const IconTrendContainer = styled(FontAwesomeIcon)`
  font-size: 16px;
`;

const TrendInfo = styled.div``;

const SeeMore = styled.div``;

const FollowContainer = styled.div``;

const PolicyContainer = styled.div`
  text-align: center;
`;

const PolicyHeader = styled.div`
  border: 3px solid red;
`;

const PolicyLink = styled.a`
  font-size: 12px;
  margin: 0 10px;
  color: gray;

  &:hover {
    text-decoration: underline;
  }
`;

const PolicyFooter = styled.div`
  font-size: 14px;
  margin-top: 5px;
`;

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
          <MenuContainer>
            <MenuImage>
              <Link to="/">
                <IconTwitterContainer icon={faTwitter}></IconTwitterContainer>
              </Link>
            </MenuImage>
            <MenuNav>
              <MenuList>
                <IconContainer icon={faHome}></IconContainer>
                <IconText>홈</IconText>
              </MenuList>
              <MenuList>
                <IconContainer icon={faHashtag}></IconContainer>
                <IconText>탐색하기</IconText>
              </MenuList>
              <MenuList>
                <IconContainer icon={faBell}></IconContainer>
                <IconText>알림</IconText>
              </MenuList>
              <MenuList>
                <IconContainer icon={faEnvelope}></IconContainer>
                <IconText>쪽지</IconText>
              </MenuList>
              <MenuList>
                <IconContainer icon={faBookmark}></IconContainer>
                <IconText>북마크</IconText>
              </MenuList>
              <MenuList>
                <IconContainer icon={faListAlt}></IconContainer>
                <IconText>리스트</IconText>
              </MenuList>
              <MenuList>
                <IconContainer icon={faUser}></IconContainer>
                <IconText>프로필</IconText>
              </MenuList>
              <MenuList>
                <IconContainer icon={faEllipsisH}></IconContainer>
                <IconText>더보기</IconText>
              </MenuList>
            </MenuNav>
            <MenuButton>트윗하기</MenuButton>
          </MenuContainer>
          <UserContainer>
            <UserPhoto src={userObject.photoURL ? userObject.photoURL : userImage}></UserPhoto>
            <UserInfo>
              <UserName>{userObject.displayName ? userObject.displayName : "유저"}</UserName>
              <UserEmail>{userObject.email ? userObject.email : "#"}</UserEmail>
            </UserInfo>
            <IconUserEtcContainer icon={faEllipsisH}></IconUserEtcContainer>
          </UserContainer>
        </LeftContainer>
        <CenterContainer>
          <ContentContainer>
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
                  return (
                    <Tweet key={tweetObject.id} userObject={userObject} tweetObject={tweetObject} isOwner={userObject.uid === tweetObject.uid ? true : false} />
                  );
                })}
            </div>
          </ContentContainer>
        </CenterContainer>
        <RightContainer>
          <RegisterContainer></RegisterContainer>
          <TrendContainer>
            <TrendHeader>
              <TrendHeaderTitle>나를 위한 트렌드</TrendHeaderTitle>
              <IconTrendContainer icon={faCog}></IconTrendContainer>
            </TrendHeader>
            <TrendInfo></TrendInfo>
            <SeeMore>더 보기</SeeMore>
          </TrendContainer>
          <FollowContainer></FollowContainer>
          <PolicyContainer>
            <PolicyHeader>
              <PolicyLink href="https://twitter.com/ko/tos">이용약관</PolicyLink>
              <PolicyLink href="https://twitter.com/ko/privacy">개인정보 처리방침</PolicyLink>
              <PolicyLink href="https://help.twitter.com/ko/rules-and-policies/twitter-cookies">쿠키 정책</PolicyLink>
              <PolicyLink href="https://business.twitter.com/en/help.html">광고 정보</PolicyLink>
            </PolicyHeader>
            <PolicyFooter>© 2021 GW. ALL RIGHTS RESERVED.</PolicyFooter>
          </PolicyContainer>
        </RightContainer>
      </Container>
    </>
  );
};

export default Home;
