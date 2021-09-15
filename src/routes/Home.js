import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { firestoreService } from "firebaseConfiguration";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faHashtag, faEllipsisH, faCog, faSearch } from "@fortawesome/free-solid-svg-icons";
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
  padding: 17px 80px;
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
  /* border: 3px solid green; */
  flex: 2.5;
`;

const ContentContainer = styled.div``;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContentOrderBy = styled.button`
  padding: 10px 15px;
  background-color: var(--twitter-color);
  color: white;
  border-radius: 30px;
  font-size: 15px;
  font-weight: bold;

  &:hover {
    background-color: var(--twitter-dark-color);
  }
`;

const ContentSearch = styled.div``;

const ContentForm = styled.form`
  position: relative;
`;

const ContentInput = styled.input`
  border: none;
  outline: none;
  width: 310px;
  box-sizing: border-box;
  padding: 15px;
  padding-left: 50px;
  padding-right: 30px;
  border-radius: 30px;
  background-color: #f8f8f8;
  font-size: 15px;
  border: 1px solid transparent;

  &:focus {
    background-color: #fff;
    border: 1px solid var(--twitter-color);
  }

  &::placeholder {
    color: gray;
  }
`;

const IconContentFormContainer = styled(FontAwesomeIcon)`
  font-size: 15px;
  cursor: pointer;
  color: gray;
  position: absolute;
  top: 50%;
  left: 22px;
  transform: translateY(-50%);
`;

const ContentTweet = styled.div`
  border: 3px solid red;
  display: flex;
`;

const TweetImage = styled.img`
  width: 47px;
  height: 47px;
  border-radius: 50%;
`;
const TweetPostContainer = styled.div`
  border: 3px solid blue;
  width: 100%;
  margin-left: 10px;
`;
const TweetPostHeader = styled.div`
  border: 3px solid green;
  height: 200px;
`;

const ContentArticle = styled.div`
  margin-top: 100px;
`;

const ContentPost = styled.div``;

const RightContainer = styled.div`
  flex: 1.3;
`;

const RegisterContainer = styled.div`
  /* border: 3px solid blue; */
`;

const TrendContainer = styled.div`
  background-color: white;
  background-color: #f8f8f8;
  border-radius: 20px;
  padding: 20px 0;
`;

const TrendHeader = styled.h1`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TrendHeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-left: 12px;
`;

const IconTrendContainer = styled(FontAwesomeIcon)`
  font-size: 16px;
  margin-right: 11px;
  cursor: pointer;
`;

const TrendInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 12px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: #eeeeee;
  }
`;

const TrendContent = styled.div``;

const TrendHeading = styled.h3`
  font-size: 13px;
  color: #272c30;
`;

const TrendTitle = styled.h1`
  font-size: 16px;
  font-weight: bold;
  margin-top: 5px;
`;

const IconTrendDotContainer = styled(FontAwesomeIcon)`
  font-size: 15px;
  cursor: pointer;
  color: #272c30;
`;

const SeeMore = styled.div`
  color: var(--twitter-color);
  font-size: 14px;
  cursor: pointer;
  margin-top: 30px;
  margin-left: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

const FollowContainer = styled.div`
  background-color: white;
  background-color: #f8f8f8;
  border-radius: 20px;
  margin-top: 15px;
  padding: 20px 0;
`;

const FollowHeader = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-left: 12px;
`;

const FollowContent = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  cursor: pointer;
  padding: 10px 12px;

  &:hover {
    background-color: #eeeeee;
  }
`;
const FollowImage = styled.img`
  width: 47px;
  height: 47px;
  border-radius: 50%;
`;
const FollowInfo = styled.div`
  margin-left: 15px;
  margin-right: 20px;
`;

const FollowInfoTitle = styled.h1`
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 5px;
`;

const FollowInfoDesc = styled.h2`
  font-size: 15px;
`;

const FollowButton = styled.button`
  background-color: #272c30;
  color: white;
  padding: 7px 15px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: bold;
`;

const PolicyContainer = styled.div`
  margin-top: 20px;
`;

const PolicyHeader = styled.div``;

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
  margin-top: 10px;
  margin-left: 12px;
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
            <ContentHeader>
              <ContentOrderBy onClick={handleOrderBy}>{isDesc ? "오래된순" : "최신순"}</ContentOrderBy>
              <ContentSearch>
                <ContentForm onSubmit={onSearchSubmit}>
                  <ContentInput type="text" placeholder="트위터 검색" onChange={onSearchInput} value={searchText}></ContentInput>
                  <IconContentFormContainer icon={faSearch}></IconContentFormContainer>
                </ContentForm>
              </ContentSearch>
            </ContentHeader>
            <ContentTweet>
              <TweetImage src={userImage}></TweetImage>
              <TweetPostContainer>
                <TweetPostHeader>
                  <TweetForm userObject={userObject}></TweetForm>
                </TweetPostHeader>
              </TweetPostContainer>
            </ContentTweet>
            <ContentArticle>
              <ContentPost>
                <h1>전체 트윗/{allTweetsLength}</h1>
                <div>
                  {allTweets &&
                    allTweets.map((tweetObject) => {
                      return (
                        <Tweet
                          key={tweetObject.id}
                          userObject={userObject}
                          tweetObject={tweetObject}
                          isOwner={userObject.uid === tweetObject.uid ? true : false}
                        />
                      );
                    })}
                </div>
              </ContentPost>
            </ContentArticle>
          </ContentContainer>
        </CenterContainer>
        <RightContainer>
          <RegisterContainer>
            <button onClick={changeTheme}>모드 전환</button>
            <button onClick={shareTwitter}>트위터에 공유하기</button>
            <h1>로그인</h1>
            <h1>회원가입</h1>
            <h1>로그아웃</h1>
          </RegisterContainer>
          <TrendContainer>
            <TrendHeader>
              <TrendHeaderTitle>나를 위한 트렌드</TrendHeaderTitle>
              <IconTrendContainer icon={faCog}></IconTrendContainer>
            </TrendHeader>
            <TrendInfo>
              <TrendContent>
                <TrendHeading>대한민국에서 트렌드 중</TrendHeading>
                <TrendTitle>리액트</TrendTitle>
              </TrendContent>
              <IconTrendDotContainer icon={faEllipsisH}></IconTrendDotContainer>
            </TrendInfo>
            <TrendInfo>
              <TrendContent>
                <TrendHeading>대한민국에서 트렌드 중</TrendHeading>
                <TrendTitle>리액트</TrendTitle>
              </TrendContent>
              <IconTrendDotContainer icon={faEllipsisH}></IconTrendDotContainer>
            </TrendInfo>
            <TrendInfo>
              <TrendContent>
                <TrendHeading>대한민국에서 트렌드 중</TrendHeading>
                <TrendTitle>리액트</TrendTitle>
              </TrendContent>
              <IconTrendDotContainer icon={faEllipsisH}></IconTrendDotContainer>
            </TrendInfo>
            <TrendInfo>
              <TrendContent>
                <TrendHeading>대한민국에서 트렌드 중</TrendHeading>
                <TrendTitle>리액트</TrendTitle>
              </TrendContent>
              <IconTrendDotContainer icon={faEllipsisH}></IconTrendDotContainer>
            </TrendInfo>
            <SeeMore>더 보기</SeeMore>
          </TrendContainer>
          <FollowContainer>
            <FollowHeader>팔로우 추천</FollowHeader>
            <FollowContent>
              <FollowImage src={userImage}></FollowImage>
              <FollowInfo>
                <FollowInfoTitle>Apple</FollowInfoTitle>
                <FollowInfoDesc>Iphone, IPad, MacBook</FollowInfoDesc>
              </FollowInfo>
              <FollowButton>팔로우</FollowButton>
            </FollowContent>
            <FollowContent>
              <FollowImage src={userImage}></FollowImage>
              <FollowInfo>
                <FollowInfoTitle>Apple</FollowInfoTitle>
                <FollowInfoDesc>Iphone, IPad, MacBook</FollowInfoDesc>
              </FollowInfo>
              <FollowButton>팔로우</FollowButton>
            </FollowContent>
            <FollowContent>
              <FollowImage src={userImage}></FollowImage>
              <FollowInfo>
                <FollowInfoTitle>Apple</FollowInfoTitle>
                <FollowInfoDesc>Iphone, IPad, MacBook</FollowInfoDesc>
              </FollowInfo>
              <FollowButton>팔로우</FollowButton>
            </FollowContent>
            <FollowContent>
              <FollowImage src={userImage}></FollowImage>
              <FollowInfo>
                <FollowInfoTitle>Apple</FollowInfoTitle>
                <FollowInfoDesc>Iphone, IPad, MacBook</FollowInfoDesc>
              </FollowInfo>
              <FollowButton>팔로우</FollowButton>
            </FollowContent>
            <SeeMore>더 보기</SeeMore>
          </FollowContainer>
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
