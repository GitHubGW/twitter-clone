import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { firestoreService } from "firebaseConfiguration";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faBell, faEnvelope, faBookmark, faListAlt, faUser } from "@fortawesome/free-regular-svg-icons";
import { faHome, faEllipsisH, faCog, faSearch, faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import Tweet from "components/Tweet";
import TweetForm from "components/TweetForm";
import Profile from "./Profile";
import Authentication from "./Authentication";
import userImage from "images/user.png";

const Container = styled.div`
  width: 1260px;
  max-width: 1260px;
  display: flex;
`;

const LeftContainerParent = styled.div`
  width: 280px;
`;

const CenterContainerParent = styled.div`
  width: 590px;
`;

const RightContainerParent = styled.div`
  width: 330px;
`;

const LeftContainer = styled.div`
  width: 280px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  padding-right: 20px;
  box-sizing: border-box;
  padding-top: 5px;
  padding-bottom: 15px;
  border-right: 1px solid ${(props) => (props.current ? "#1e2125" : "#eee")};
`;

const MenuContainer = styled.div``;

const MenuImage = styled.div`
  margin-left: 5px;
  margin-bottom: 15px;
  display: inline-block;
`;

const IconTwitterContainer = styled(FontAwesomeIcon)`
  font-size: 30px;
  color: var(--twitter-color);
  cursor: pointer;
  border-radius: 50%;
  padding: 10px;

  &:hover {
    background-color: ${(props) => (props.current ? "#1e2125" : "#e6f3ff")};
  }
`;

const MenuNav = styled.ul``;

const MenuList = styled(Link)`
  margin-bottom: 8px;
  display: inline-block;
  margin-right: 50px;
  align-items: center;
  padding: 12px 15px;
  padding-right: 25px;
  border-radius: 50px;
  box-sizing: border-box;
  cursor: pointer;

  &:link {
    color: inherit;
  }
  &:visited {
    color: inherit;
  }
  &:hover {
    background-color: ${(props) => (props.current ? "#1e2125" : "#eeeeee")};
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
  padding: 8px 10px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.current ? "#1e2125" : "#eeeeee")};
  }
`;

const UserContainerLink = styled(Link)`
  color: inherit;
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
  font-size: 20px;
  margin-bottom: 5px;
`;

const UserEmail = styled.div`
  font-size: 17px;
  color: #989898;
`;

const IconUserEtcContainer = styled(FontAwesomeIcon)`
  flex: 1;
  font-size: 18px;
  cursor: pointer;
  padding-right: 10px;
`;

const CenterContainer = styled.div`
  width: 590px;
  max-width: 590px;
`;

const ContentContainer = styled.div`
  border-bottom: 1px solid ${(props) => (props.current ? "#1e2125" : "#eee")};
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 17px;
  border-bottom: 1px solid ${(props) => (props.current ? "#1e2125" : "#eee")};
`;

// const ContentOrderBy = styled.button`
//   padding: 12px 13px;
//   background-color: var(--twitter-color);
//   color: white;
//   border-radius: 30px;
//   font-size: 15px;
//   font-weight: bold;

//   &:hover {
//     background-color: var(--twitter-dark-color);
//   }
// `;

const ContentSearch = styled.div``;

const ContentForm = styled.form`
  position: relative;
`;

const ContentInput = styled.input`
  border: none;
  outline: none;
  width: 310px;
  box-sizing: border-box;
  padding: 12px;
  padding-left: 50px;
  padding-right: 30px;
  border-radius: 30px;
  font-size: 15px;
  border: 1px solid transparent;
  color: #989898;
  background-color: ${(props) => (props.current ? "#1e2125" : "#f8f8f8")};

  &:focus {
    border: 1px solid #00aff0;
    background-color: ${(props) => (props.current ? "#1e2125" : "#f8f8f8")};
  }

  &::placeholder {
    color: #989898;
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
  display: flex;
  padding: 17px 20px;
  border-bottom: 1px solid ${(props) => (props.current ? "#1e2125" : "#eee")};
`;

const TweetImage = styled.img`
  width: 47px;
  height: 47px;
  border-radius: 50%;
`;

const TweetPostContainer = styled.div`
  width: 100%;
  margin-left: 5px;
`;

const TweetPostHeader = styled.div`
  margin-left: 7px;
`;

const ContentArticle = styled.div``;

const ContentPost = styled.div``;

const ContentTweetNumber = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin-left: 5px;
  margin-top: 17px;
  margin-bottom: 15px;
`;

const ContentAllTweets = styled.div``;

const RightContainer = styled.div`
  width: 330px;
  padding-left: 20px;
  position: fixed;
  height: 100vh;
  border-left: 1px solid ${(props) => (props.current ? "#1e2125" : "#eee")};
`;

const RegisterContainer = styled.div``;

const TrendContainer = styled.div`
  /* background-color: #1e2125; */
  /* background-color: #202020; */
  background-color: ${(props) => (props.current ? "#1e2125" : "#f8f8f8")};
  border-radius: 20px;
  padding: 20px 0px;
  margin-top: 15px;
`;

const TrendHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TrendHeaderTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-left: 17px;
`;

const IconTrendContainer = styled(FontAwesomeIcon)`
  font-size: 16px;
  margin-right: 15px;
  cursor: pointer;
`;

const TrendInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 17px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.current ? "#2E3336" : "#eeeeee")};
  }
`;

const TrendContent = styled.div``;

const TrendHeading = styled.h3`
  font-size: 13px;
  color: #989898;
`;

const TrendTitle = styled.h1`
  font-size: 16px;
  font-weight: bold;
  margin-top: 5px;
`;

const IconTrendDotContainer = styled(FontAwesomeIcon)`
  font-size: 15px;
  cursor: pointer;
  color: #989898;
`;

const SeeMore = styled.div`
  color: var(--twitter-color);
  font-size: 14px;
  cursor: pointer;
  margin-top: 30px;
  margin-left: 17px;

  &:hover {
    text-decoration: underline;
  }
`;

const FollowContainer = styled.div`
  background-color: ${(props) => (props.current ? "#1e2125" : "#f8f8f8")};
  border-radius: 20px;
  margin-top: 15px;
  padding: 20px 0px;
`;

const FollowHeader = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-left: 17px;
`;

const FollowContent = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  cursor: pointer;
  padding: 10px 17px;

  &:hover {
    background-color: ${(props) => (props.current ? "#2E3336" : "#eeeeee")};
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
  color: white;
  padding: 7px 15px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: bold;
  background-color: ${(props) => (props.current ? "#303030" : "#272c30")};
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

const GototopButton = styled.button`
  position: fixed;
  bottom: 60px;
  right: 60px;
  z-index: 50;
  width: 47px;
  height: 47px;
  background: #1da1f2;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
  transition: 0.3s;

  &:hover {
    transform: scale(0.9);
  }
`;

const IconGototopButton = styled(FontAwesomeIcon)`
  font-size: 38px;
  color: white;
`;

const Home = ({ userObject, refreshDisplayName, createNotification, isDark, changeTheme }) => {
  const [allTweets, setAllTweets] = useState(""); // Document에 있는 모튼 트윗들
  const [allTweetsLength, setAllTweetsLength] = useState(0); // Document에 있는 모튼 트윗 갯수
  const [searchText, setSearchText] = useState(""); // 트위터 검색
  // const [isDesc, setIsDesc] = useState(true); // 트윗 정렬 순서
  const twitterSearch = useRef();
  const history = useHistory();
  const {
    location: { pathname },
  } = history;

  /*
  // 트윗 정렬 (최신순, 오래된순)
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
  */

  // 공유하기 버튼
  const shareTwitter = () => {
    var sendText = "노마드 코더";
    var sendUrl = "https://nomadcoders.co";
    window.open(`https://twitter.com/intent/tweet?text=${sendText}&url=${sendUrl}`);
  };

  // 트위터 검색 결과창
  const onSearchSubmit = (event) => {
    event.preventDefault();
    window.open(`https://twitter.com/search?q=${searchText}&src=typed_query`);
    setSearchText("");
  };

  // 트위터 검색창 value
  const onSearchInput = (event) => {
    const {
      target: { value },
    } = event;

    setSearchText(value);
  };

  // 트위터 검색창 포커싱
  const onFocusTwitterSearch = (event) => {
    twitterSearch.current.focus();
  };

  // const handleOrderByDesc = async () => {
  //   const getDesc = await firestoreService.collection("tweets").orderBy("createdAtTime", "desc").get();
  //   console.log("getDesc", getDesc);
  // };

  useEffect(() => {
    firestoreService
      .collection("tweets")
      .orderBy("createdAtTime", "desc")
      .onSnapshot((querySnapshot) => {
        // 전체 트윗 가져오기 (map사용)
        const queryDocumentSnapshotObjectArray = querySnapshot.docs.map((queryDocumentSnapshot) => ({
          id: queryDocumentSnapshot.id,
          documentId: queryDocumentSnapshot.id,
          ...queryDocumentSnapshot.data(),
        }));
        const querySnapshotSize = querySnapshot.size;

        setAllTweetsLength(querySnapshotSize);
        setAllTweets(queryDocumentSnapshotObjectArray);
      });
  }, []);

  return (
    <>
      <Container>
        <Helmet>
          <title>트위터 / 홈</title>
        </Helmet>
        {/* 메뉴 (좌측) */}
        <LeftContainerParent>
          <LeftContainer current={isDark ? true : false}>
            <MenuContainer>
              <MenuImage>
                <Link to="/">
                  <IconTwitterContainer icon={faTwitter} current={isDark ? true : false}></IconTwitterContainer>
                </Link>
              </MenuImage>
              <MenuNav>
                <MenuList current={isDark ? true : false} to="/">
                  <IconContainer icon={faHome}></IconContainer>
                  <IconText>홈</IconText>
                </MenuList>
                <MenuList current={isDark ? true : false} to={userObject ? "/profile" : "/"}>
                  <IconContainer icon={faUser}></IconContainer>
                  <IconText>프로필</IconText>
                </MenuList>
                <MenuList current={isDark ? true : false} to="/" onClick={onFocusTwitterSearch}>
                  <IconContainer icon={faSearch}></IconContainer>
                  <IconText>검색</IconText>
                </MenuList>
                <MenuList current={isDark ? true : false} to="/">
                  <IconContainer icon={faBell}></IconContainer>
                  <IconText>알림</IconText>
                </MenuList>
                <MenuList current={isDark ? true : false} to="/">
                  <IconContainer icon={faEnvelope}></IconContainer>
                  <IconText>쪽지</IconText>
                </MenuList>
                <MenuList current={isDark ? true : false} to="/">
                  <IconContainer icon={faBookmark}></IconContainer>
                  <IconText>북마크</IconText>
                </MenuList>
                <MenuList current={isDark ? true : false} to="/">
                  <IconContainer icon={faListAlt}></IconContainer>
                  <IconText>리스트</IconText>
                </MenuList>
                <MenuList current={isDark ? true : false} to="/">
                  <IconContainer icon={faEllipsisH}></IconContainer>
                  <IconText>더보기</IconText>
                </MenuList>
              </MenuNav>
              <MenuButton type="button" onClick={shareTwitter}>
                공유하기
              </MenuButton>
            </MenuContainer>
            <UserContainerLink to={userObject === null ? "/" : "/profile"}>
              <UserContainer current={isDark ? true : false}>
                <UserPhoto src={userObject?.photoURL ? userObject.photoURL : userImage}></UserPhoto>
                <UserInfo>
                  <UserName>{userObject?.displayName ? userObject.displayName : "유저"}</UserName>
                  <UserEmail>{userObject?.email ? userObject.email : "로그인 안됨"}</UserEmail>
                </UserInfo>
                <IconUserEtcContainer icon={faEllipsisH}></IconUserEtcContainer>
              </UserContainer>
            </UserContainerLink>
          </LeftContainer>
        </LeftContainerParent>

        {/* 트윗 목록 (중앙) */}
        <CenterContainerParent>
          <CenterContainer>
            <ContentContainer current={isDark ? true : false}>
              <ContentHeader current={isDark ? true : false}>
                {/* <ContentOrderBy onClick={handleOrderBy}>{isDesc ? "오래된순" : "최신순"}</ContentOrderBy> */}
                <ContentTweetNumber>전체 트윗 ({allTweetsLength})</ContentTweetNumber>
                <ContentSearch>
                  <ContentForm onSubmit={onSearchSubmit}>
                    <ContentInput
                      current={isDark ? true : false}
                      type="text"
                      placeholder="트위터 검색"
                      onChange={onSearchInput}
                      value={searchText}
                      ref={twitterSearch}
                    ></ContentInput>
                    <IconContentFormContainer icon={faSearch}></IconContentFormContainer>
                  </ContentForm>
                </ContentSearch>
              </ContentHeader>
              <ContentTweet current={isDark ? true : false}>
                <TweetImage src={userImage}></TweetImage>
                <TweetPostContainer>
                  <TweetPostHeader>
                    <TweetForm userObject={userObject} createNotification={createNotification} isDark={isDark}></TweetForm>
                  </TweetPostHeader>
                </TweetPostContainer>
              </ContentTweet>
              <ContentArticle>
                <ContentPost>
                  {pathname === "/" ? (
                    <ContentAllTweets>
                      {allTweets &&
                        allTweets.map((tweetObject) => {
                          return (
                            <Tweet
                              key={tweetObject?.id}
                              userObject={userObject}
                              tweetObject={tweetObject}
                              isOwner={userObject?.uid === tweetObject?.uid ? true : false}
                              createNotification={createNotification}
                              isDark={isDark}
                            />
                          );
                        })}
                    </ContentAllTweets>
                  ) : (
                    <ContentAllTweets>
                      <Profile
                        userObject={userObject}
                        refreshDisplayName={refreshDisplayName}
                        createNotification={createNotification}
                        isDark={isDark}
                        changeTheme={changeTheme}
                        isDark={isDark}
                      ></Profile>
                    </ContentAllTweets>
                  )}
                </ContentPost>
              </ContentArticle>
            </ContentContainer>
          </CenterContainer>
        </CenterContainerParent>

        {/* 트렌드, 팔로우 (우측) */}
        <RightContainerParent>
          <RightContainer current={isDark ? true : false}>
            <RegisterContainer>
              <Authentication userObject={userObject} createNotification={createNotification} isDark={isDark} changeTheme={changeTheme}></Authentication>
            </RegisterContainer>
            <TrendContainer current={isDark ? true : false}>
              <TrendHeader>
                <TrendHeaderTitle>나를 위한 트렌드</TrendHeaderTitle>
                <IconTrendContainer icon={faCog}></IconTrendContainer>
              </TrendHeader>
              <TrendInfo current={isDark ? true : false}>
                <TrendContent>
                  <TrendHeading>대한민국에서 트렌드 중</TrendHeading>
                  <TrendTitle>리액트</TrendTitle>
                </TrendContent>
                <IconTrendDotContainer icon={faEllipsisH}></IconTrendDotContainer>
              </TrendInfo>
              <TrendInfo current={isDark ? true : false}>
                <TrendContent>
                  <TrendHeading>대한민국에서 트렌드 중</TrendHeading>
                  <TrendTitle>리액트</TrendTitle>
                </TrendContent>
                <IconTrendDotContainer icon={faEllipsisH}></IconTrendDotContainer>
              </TrendInfo>
              <TrendInfo current={isDark ? true : false}>
                <TrendContent>
                  <TrendHeading>대한민국에서 트렌드 중</TrendHeading>
                  <TrendTitle>리액트</TrendTitle>
                </TrendContent>
                <IconTrendDotContainer icon={faEllipsisH}></IconTrendDotContainer>
              </TrendInfo>
              <TrendInfo current={isDark ? true : false}>
                <TrendContent>
                  <TrendHeading>대한민국에서 트렌드 중</TrendHeading>
                  <TrendTitle>리액트</TrendTitle>
                </TrendContent>
                <IconTrendDotContainer icon={faEllipsisH}></IconTrendDotContainer>
              </TrendInfo>
              <SeeMore>더 보기</SeeMore>
            </TrendContainer>
            <FollowContainer current={isDark ? true : false}>
              <FollowHeader>팔로우 추천</FollowHeader>
              <FollowContent current={isDark ? true : false}>
                <FollowImage src={userImage}></FollowImage>
                <FollowInfo>
                  <FollowInfoTitle>Apple</FollowInfoTitle>
                  <FollowInfoDesc>Iphone, IPad, MacBook</FollowInfoDesc>
                </FollowInfo>
                <FollowButton current={isDark ? true : false}>팔로우</FollowButton>
              </FollowContent>
              <FollowContent current={isDark ? true : false}>
                <FollowImage src={userImage}></FollowImage>
                <FollowInfo>
                  <FollowInfoTitle>Apple</FollowInfoTitle>
                  <FollowInfoDesc>Iphone, IPad, MacBook</FollowInfoDesc>
                </FollowInfo>
                <FollowButton current={isDark ? true : false}>팔로우</FollowButton>
              </FollowContent>
              <FollowContent current={isDark ? true : false}>
                <FollowImage src={userImage}></FollowImage>
                <FollowInfo>
                  <FollowInfoTitle>Apple</FollowInfoTitle>
                  <FollowInfoDesc>Iphone, IPad, MacBook</FollowInfoDesc>
                </FollowInfo>
                <FollowButton current={isDark ? true : false}>팔로우</FollowButton>
              </FollowContent>
              <FollowContent current={isDark ? true : false}>
                <FollowImage src={userImage}></FollowImage>
                <FollowInfo>
                  <FollowInfoTitle>Apple</FollowInfoTitle>
                  <FollowInfoDesc>Iphone, IPad, MacBook</FollowInfoDesc>
                </FollowInfo>
                <FollowButton current={isDark ? true : false}>팔로우</FollowButton>
              </FollowContent>
              <SeeMore>더 보기</SeeMore>
            </FollowContainer>
            <PolicyContainer>
              <PolicyHeader>
                <PolicyLink href="https://twitter.com/ko/tos" target="_blank">
                  이용약관
                </PolicyLink>
                <PolicyLink href="https://twitter.com/ko/privacy" target="_blank">
                  개인정보 처리방침
                </PolicyLink>
                <PolicyLink href="https://help.twitter.com/ko/rules-and-policies/twitter-cookies" target="_blank">
                  쿠키 정책
                </PolicyLink>
                <PolicyLink href="https://business.twitter.com/en/help.html" target="_blank">
                  광고 정보
                </PolicyLink>
              </PolicyHeader>
              <PolicyFooter>© 2021 GW. ALL RIGHTS RESERVED.</PolicyFooter>
            </PolicyContainer>
          </RightContainer>
        </RightContainerParent>

        <GototopButton type="button" onClick={() => window.scrollTo(0, 0)}>
          <IconGototopButton icon={faArrowCircleUp}></IconGototopButton>
        </GototopButton>
      </Container>
    </>
  );
};

Home.propTypes = {
  userObject: PropTypes.object,
  refreshDisplayName: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
  changeTheme: PropTypes.func.isRequired,
};

export default Home;
