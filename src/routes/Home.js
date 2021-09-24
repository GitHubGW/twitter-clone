import { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { firestoreService } from "firebaseConfiguration";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faBell, faEnvelope, faBookmark, faListAlt, faUser } from "@fortawesome/free-regular-svg-icons";
import { faHome, faEllipsisH, faCog, faSearch, faArrowCircleUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import Tweet from "components/Tweet";
import TweetForm from "components/TweetForm";
import Profile from "./Profile";
import Authentication from "./Authentication";
import userImage from "images/user.png";
import nomadCoderImage from "images/nomadcoder-logo-black.jpeg";
import appleImage from "images/apple-logo.png";
import nasaImage from "images/nasa-logo.jpeg";
import codingImage from "images/coding-logo.png";

const Container = styled.div`
  width: 1260px;
  max-width: 1260px;
  display: flex;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

const LeftContainerParent = styled.div`
  width: 280px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CenterContainerParent = styled.div`
  width: 590px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RightContainerParent = styled.div`
  width: 330px;

  @media (max-width: 768px) {
    display: none;
  }
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
  border-right: 1px solid ${(props) => (props.current === "true" ? "#1e2125" : "#eee")};
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
    background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#e6f3ff")};
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
    background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#eeeeee")};
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
    background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#eeeeee")};
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

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  border-bottom: 1px solid ${(props) => (props.current === "true" ? "#1e2125" : "#eee")};
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 17px;
  border-bottom: 1px solid ${(props) => (props.current === "true" ? "#1e2125" : "#eee")};
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
  background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#f8f8f8")};

  &:focus {
    border: 1px solid #00aff0;
    background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#f8f8f8")};
  }
  &::placeholder {
    color: #989898;
  }

  @media (max-width: 768px) {
    width: 230px;
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
  border-bottom: 1px solid ${(props) => (props.current === "true" ? "#1e2125" : "#eee")};
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
  border-left: 1px solid ${(props) => (props.current === "true" ? "#1e2125" : "#eee")};
`;

const RegisterContainer = styled.div``;

const TrendContainer = styled.div`
  background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#f8f8f8")};
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

const TrendInfo = styled.a`
  display: flex;
  justify-content: space-between;
  padding: 13px 17px;
  margin-top: 10px;
  cursor: pointer;
  color: ${(props) => (props.current === "true" ? "#cccccc" : "#31302E")};

  &:hover {
    background-color: ${(props) => (props.current === "true" ? "#2E3336" : "#eeeeee")};
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
  margin-top: 10px;
  margin-left: 17px;

  &:hover {
    text-decoration: underline;
  }
`;

const FollowContainer = styled.div`
  background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#f8f8f8")};
  border-radius: 20px;
  margin-top: 15px;
  padding: 20px 0px;
`;

const FollowHeader = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-left: 17px;
`;

const FollowLink = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
  color: inherits;

  &:visited {
    color: inherit;
  }
`;

const FollowContent = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  cursor: pointer;
  padding: 10px 17px;

  &:hover {
    background-color: ${(props) => (props.current === "true" ? "#2E3336" : "#eeeeee")};
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
  color: ${(props) => (props.current === "true" ? "#cccccc" : "#31302E")};
`;

const FollowInfoDesc = styled.h2`
  font-size: 15px;
  color: ${(props) => (props.current === "true" ? "#cccccc" : "#31302E")};
`;

const FollowButton = styled.span`
  color: white;
  padding: 7px 15px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: bold;
  background-color: ${(props) => (props.current === "true" ? "#303030" : "#272c30")};
  margin-left: auto;
`;

const PolicyContainer = styled.div`
  margin-top: 20px;
`;

const PolicyHeader = styled.div``;

const PolicyLink = styled.a`
  font-size: 11px;
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
    transform: scale(0.85);
  }

  @media (max-width: 768px) {
    bottom: 70px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
`;

const IconGototopButton = styled(FontAwesomeIcon)`
  font-size: 38px;
  color: white;
`;

// 모바일 하단 메뉴
const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 6px 0;
    box-sizing: border-box;
    border-top: 1px solid ${(props) => (props.current === "true" ? "#404040" : "#eee")};
    background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#fff")};
  }
`;

const MobileHome = styled(Link)``;

const MobileProfile = styled(Link)``;

const MobileSearch = styled.div``;

const MobileDarkMode = styled.button`
  font-size: 27px;
`;

const IconMobileHome = styled(FontAwesomeIcon)`
  font-size: 23px;
  color: #989898;
`;

const IconMobileProfile = styled(FontAwesomeIcon)`
  font-size: 23px;
  color: #989898;
`;

const IconMobileSearch = styled(FontAwesomeIcon)`
  font-size: 23px;
  color: #989898;
`;

// 팔로워 폼
const LoginFormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 625px;
  height: 700px;
  overflow-y: scroll;
  z-index: 10;
  background-color: white;
  border-radius: 20px;
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 30px 90px;
  background-color: ${(props) => (props.current === "true" ? "#1e2125" : "#f8f8f8")};
  border: 1px solid ${(props) => (props.current === "true" ? "#404040" : "#eee")};

  &::-webkit-scrollbar {
    width: 11px;
    height: 11px;
    background: #ffffff;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background-color: #787878;

    &:hover {
      background-color: #444;
    }
    &:active {
      background-color: #444;
    }
  }
  &::-webkit-scrollbar-track {
    background-color: lightgray;
  }
`;

const LoginFormContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 30px;
  padding-right: 35px;
  align-items: flex-start;
`;

const PostingTweetAuthorImage = styled.img`
  width: 47px;
  height: 47px;
  border-radius: 50%;
  margin-right: 17px;

  @media (max-width: 768px) {
    margin-right: 10px;
  }
`;

const PostingTweetContent = styled.div`
  width: 100%;
`;

const PostingTweetAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  height: 40px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const AuthorName = styled.h2`
  font-size: 17px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const AuthorEmail = styled.h3`
  font-size: 16px;
  margin-left: 7px;
  color: gray;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const AuthorCreatedAt = styled.h4`
  font-size: 14px;
  color: gray;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const AuthorDot = styled.span`
  font-size: 15px;
  margin: 0 5px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const PostingTweetDesc = styled.p`
  margin-bottom: 8px;
  font-size: 16px;
  line-height: 1.5;
`;

const PostingTweetImage = styled.img`
  width: 490px;
  height: 280px;
  border-radius: 15px;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const IconTweetLikeNumber = styled.span`
  color: #f91880;
  font-size: 15px;
  font-weight: 500;
  margin-left: 5px;
`;

const IconSVGContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 7px;
`;

const IconHeartContainer = styled.div`
  display: flex;
  align-items: center;
  width: 50px;
`;

const CloseButton = styled(FontAwesomeIcon)`
  position: absolute;
  top: 30px;
  right: 38px;
  font-size: 28px;
  cursor: pointer;
  color: gray;

  &:hover {
    color: ${(props) => (props.current === "true" ? "#DCDCDC" : "#303030")};
  }
`;

const PostingTweetFollowerContainer = styled.div`
  margin-top: 18px;
`;

const PostingTweetTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 32px;
`;

const PostingTweetFollower = styled.div`
  display: flex;
  margin-bottom: 30px;
`;

const IconSVG = styled.svg`
  height: 20px;
  cursor: pointer;
  border-radius: 50%;
  padding: 5px;

  &:hover {
    fill: ${(props) => (props.current === "true" ? "#1DA1F2" : "#bebebe")};
    background-color: ${(props) => (props.current === "true" ? "#2E3336" : "#e6f3ff")};
  }
`;

const IconG = styled.g``;

const IconPath = styled.path``;

const Home = ({ userObject, refreshDisplayName, createNotification, isDark, changeTheme }) => {
  // const [isDesc, setIsDesc] = useState(true); // 트윗 정렬 순서
  const [allTweets, setAllTweets] = useState(""); // Document에 있는 모튼 트윗들
  const [allTweetsLength, setAllTweetsLength] = useState(0); // Document에 있는 모튼 트윗 갯수
  const [searchText, setSearchText] = useState(""); // 트위터 검색
  const [searchTweetLength, setSearchTweetsLength] = useState(0);
  const [searchTweet, setSearchTweets] = useState("");
  const [isFollower, setIsFollower] = useState(false);
  const [isSearchTweetAuthor, setSearchTweetAuthor] = useState("유저");
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
    var sendText = "노마드 코더 트위터 클론";
    var sendUrl = "https://nomadcoders.co/nwitter";
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

  const handleFollower = async (email) => {
    await firestoreService
      .collection("tweets")
      .where("email", "==", email)
      .orderBy("createdAtTime", "desc")
      .onSnapshot((querySnapshot) => {
        const querySnapshotSize = querySnapshot.size;
        const queryDocumentSnapshotObjectArray = querySnapshot.docs.map((queryDocumentSnapshot) => ({
          id: queryDocumentSnapshot.id,
          documentId: queryDocumentSnapshot.id,
          ...queryDocumentSnapshot.data(),
        }));
        setSearchTweetsLength(querySnapshotSize);
        setSearchTweets(queryDocumentSnapshotObjectArray);
        setSearchTweetAuthor(queryDocumentSnapshotObjectArray[0]?.displayName);
      });

    setIsFollower(!isFollower);
  };

  const handleCloseFollower = () => {
    setIsFollower(false);
  };

  const getTime = (time) => {
    const now = parseInt(time);
    const date = new Date(now);
    const day = ["일", "월", "화", "수", "목", "금", "토"];
    const getMonth = date.getMonth() + 1;
    const getDate = date.getDate();
    const getDay = day[date.getDay()];
    return `${getMonth}월 ${getDate}일 (${getDay})`;
  };

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
          <title>{`트위터 / 홈`}</title>
        </Helmet>
        {/* 메뉴 (좌측) */}
        <LeftContainerParent>
          <LeftContainer current={isDark ? "true" : "false"}>
            <MenuContainer>
              <MenuImage>
                <Link to="/">
                  <IconTwitterContainer icon={faTwitter} current={isDark ? "true" : "false"}></IconTwitterContainer>
                </Link>
              </MenuImage>
              <MenuNav>
                <MenuList current={isDark ? "true" : "false"} to="/">
                  <IconContainer icon={faHome}></IconContainer>
                  <IconText>홈</IconText>
                </MenuList>
                <MenuList current={isDark ? "true" : "false"} to={userObject ? "/profile" : "/"}>
                  <IconContainer icon={faUser}></IconContainer>
                  <IconText>프로필</IconText>
                </MenuList>
                <MenuList current={isDark ? "true" : "false"} to="/" onClick={onFocusTwitterSearch}>
                  <IconContainer icon={faSearch}></IconContainer>
                  <IconText>검색</IconText>
                </MenuList>
                <MenuList current={isDark ? "true" : "false"} to="/">
                  <IconContainer icon={faBell}></IconContainer>
                  <IconText>알림</IconText>
                </MenuList>
                <MenuList current={isDark ? "true" : "false"} to="/">
                  <IconContainer icon={faEnvelope}></IconContainer>
                  <IconText>쪽지</IconText>
                </MenuList>
                <MenuList current={isDark ? "true" : "false"} to="/">
                  <IconContainer icon={faBookmark}></IconContainer>
                  <IconText>북마크</IconText>
                </MenuList>
                <MenuList current={isDark ? "true" : "false"} to="/">
                  <IconContainer icon={faListAlt}></IconContainer>
                  <IconText>리스트</IconText>
                </MenuList>
                <MenuList current={isDark ? "true" : "false"} to="/">
                  <IconContainer icon={faEllipsisH}></IconContainer>
                  <IconText>더보기</IconText>
                </MenuList>
              </MenuNav>
              <MenuButton type="button" onClick={shareTwitter}>
                공유하기
              </MenuButton>
            </MenuContainer>
            <UserContainerLink to={userObject === null ? "/" : "/profile"}>
              <UserContainer current={isDark ? "true" : "false"}>
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
            <ContentContainer current={isDark ? "true" : "false"}>
              <ContentHeader current={isDark ? "true" : "false"}>
                {/* <ContentOrderBy onClick={handleOrderBy}>{isDesc ? "오래된순" : "최신순"}</ContentOrderBy> */}
                <ContentTweetNumber>전체 트윗 ({allTweetsLength})</ContentTweetNumber>
                <ContentSearch>
                  <ContentForm onSubmit={onSearchSubmit}>
                    <ContentInput
                      current={isDark ? "true" : "false"}
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
              <ContentTweet current={isDark ? "true" : "false"}>
                <TweetImage src={userObject?.photoURL ? userObject.photoURL : userImage}></TweetImage>
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
          <RightContainer current={isDark ? "true" : "false"}>
            <RegisterContainer>
              <Authentication userObject={userObject} createNotification={createNotification} isDark={isDark} changeTheme={changeTheme}></Authentication>
            </RegisterContainer>
            <TrendContainer current={isDark ? "true" : "false"}>
              <TrendHeader>
                <TrendHeaderTitle>나를 위한 트렌드</TrendHeaderTitle>
                <IconTrendContainer icon={faCog}></IconTrendContainer>
              </TrendHeader>
              <TrendInfo href="https://nomadcoders.co" target="_blank" current={isDark ? "true" : "false"}>
                <TrendContent>
                  <TrendHeading>노마드코더에서 트렌드 중</TrendHeading>
                  <TrendTitle>트위터 클론</TrendTitle>
                </TrendContent>
                <IconTrendDotContainer icon={faEllipsisH}></IconTrendDotContainer>
              </TrendInfo>
              <TrendInfo href="https://nomadcoders.co/nwitter" target="_blank" current={isDark ? "true" : "false"}>
                <TrendContent>
                  <TrendHeading>페이스북, 구글에서 트렌드 중</TrendHeading>
                  <TrendTitle>리액트, 파이어베이스</TrendTitle>
                </TrendContent>
                <IconTrendDotContainer icon={faEllipsisH}></IconTrendDotContainer>
              </TrendInfo>
              <SeeMore>더 보기</SeeMore>
            </TrendContainer>
            <FollowContainer current={isDark ? "true" : "false"}>
              <FollowHeader>팔로우 추천</FollowHeader>
              <FollowContent current={isDark ? "true" : "false"} onClick={() => handleFollower("nomadcoders@twitter.com")}>
                <FollowLink>
                  <FollowImage src={nomadCoderImage}></FollowImage>
                  <FollowInfo>
                    <FollowInfoTitle current={isDark ? "true" : "false"}>Nomad Coders</FollowInfoTitle>
                    <FollowInfoDesc current={isDark ? "true" : "false"}>@Nomad Coders</FollowInfoDesc>
                  </FollowInfo>
                  <FollowButton current={isDark ? "true" : "false"}>팔로우</FollowButton>
                </FollowLink>
              </FollowContent>
              <FollowContent current={isDark ? "true" : "false"} onClick={() => handleFollower("apple@twitter.com")}>
                <FollowLink>
                  <FollowImage src={appleImage}></FollowImage>
                  <FollowInfo>
                    <FollowInfoTitle current={isDark ? "true" : "false"}>Apple</FollowInfoTitle>
                    <FollowInfoDesc current={isDark ? "true" : "false"}>@Apple</FollowInfoDesc>
                  </FollowInfo>
                  <FollowButton current={isDark ? "true" : "false"}>팔로우</FollowButton>
                </FollowLink>
              </FollowContent>
              <FollowContent current={isDark ? "true" : "false"} onClick={() => handleFollower("nasa@twitter.com")}>
                <FollowLink>
                  <FollowImage src={nasaImage}></FollowImage>
                  <FollowInfo>
                    <FollowInfoTitle current={isDark ? "true" : "false"}>NASA</FollowInfoTitle>
                    <FollowInfoDesc current={isDark ? "true" : "false"}>@NASA</FollowInfoDesc>
                  </FollowInfo>
                  <FollowButton current={isDark ? "true" : "false"}>팔로우</FollowButton>
                </FollowLink>
              </FollowContent>
              <FollowContent current={isDark ? "true" : "false"} onClick={() => handleFollower("coding@twitter.com")}>
                <FollowLink>
                  <FollowImage src={codingImage}></FollowImage>
                  <FollowInfo>
                    <FollowInfoTitle current={isDark ? "true" : "false"}>Coding</FollowInfoTitle>
                    <FollowInfoDesc current={isDark ? "true" : "false"}>@Coding</FollowInfoDesc>
                  </FollowInfo>
                  <FollowButton current={isDark ? "true" : "false"}>팔로우</FollowButton>
                </FollowLink>
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

        {/* 팔로워 폼 */}
        {isFollower ? (
          <LoginFormContainer current={isDark ? "true" : "false"}>
            <LoginFormContent>
              <CloseButton current={isDark ? "true" : "false"} icon={faTimes} type="button" onClick={handleCloseFollower}></CloseButton>
              <PostingTweetFollowerContainer>
                <PostingTweetTitle>
                  {isSearchTweetAuthor && isSearchTweetAuthor}님이 작성한 트윗 ({searchTweetLength})
                </PostingTweetTitle>
                {searchTweet &&
                  searchTweet.map((tweetObject) => (
                    <PostingTweetFollower>
                      <PostingTweetAuthorImage src={tweetObject.photoURL ? tweetObject.photoURL : userImage}></PostingTweetAuthorImage>
                      <PostingTweetContent>
                        <PostingTweetAuthor>
                          <AuthorInfo>
                            <AuthorName>{tweetObject.displayName}</AuthorName>
                            <AuthorEmail>{tweetObject.email}</AuthorEmail>
                            <AuthorDot>·</AuthorDot>
                            <AuthorCreatedAt>{getTime(tweetObject.createdAtTime)}</AuthorCreatedAt>
                          </AuthorInfo>
                        </PostingTweetAuthor>
                        <PostingTweetDesc>{tweetObject.content}</PostingTweetDesc>
                        {tweetObject.fileDownloadUrl && <PostingTweetImage src={tweetObject.fileDownloadUrl} alt={tweetObject.content}></PostingTweetImage>}

                        <IconSVGContainer>
                          <IconHeartContainer>
                            <IconSVG
                              current={isDark ? "true" : "false"}
                              style={{ fill: "#f91880" }}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
                            >
                              <IconG>
                                <IconPath d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z"></IconPath>
                              </IconG>
                            </IconSVG>
                            <IconTweetLikeNumber>{tweetObject.likesArray.length}</IconTweetLikeNumber>
                          </IconHeartContainer>
                          <IconSVG
                            current={isDark ? "true" : "false"}
                            style={{ fill: "#00cec9" }}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
                          >
                            <IconG>
                              <IconPath d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></IconPath>
                            </IconG>
                          </IconSVG>
                          <IconSVG
                            current={isDark ? "true" : "false"}
                            style={{ fill: "#74b9ff" }}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
                          >
                            <IconG>
                              <IconPath d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></IconPath>
                            </IconG>
                          </IconSVG>
                          <IconSVG
                            current={isDark ? "true" : "false"}
                            style={{ fill: "#b2bec3" }}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi"
                          >
                            <IconG>
                              <IconPath d="M17.53 7.47l-5-5c-.293-.293-.768-.293-1.06 0l-5 5c-.294.293-.294.768 0 1.06s.767.294 1.06 0l3.72-3.72V15c0 .414.336.75.75.75s.75-.336.75-.75V4.81l3.72 3.72c.146.147.338.22.53.22s.384-.072.53-.22c.293-.293.293-.767 0-1.06z"></IconPath>
                              <IconPath d="M19.708 21.944H4.292C3.028 21.944 2 20.916 2 19.652V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 .437.355.792.792.792h15.416c.437 0 .792-.355.792-.792V14c0-.414.336-.75.75-.75s.75.336.75.75v5.652c0 1.264-1.028 2.292-2.292 2.292z"></IconPath>
                            </IconG>
                          </IconSVG>
                        </IconSVGContainer>
                      </PostingTweetContent>
                    </PostingTweetFollower>
                  ))}
              </PostingTweetFollowerContainer>
            </LoginFormContent>
          </LoginFormContainer>
        ) : null}

        <MobileMenu current={isDark ? "true" : "false"}>
          <MobileHome to="/">
            <IconMobileHome icon={faHome}></IconMobileHome>
          </MobileHome>
          <MobileProfile to={userObject ? "/profile" : "/"}>
            <IconMobileProfile icon={faUser}></IconMobileProfile>
          </MobileProfile>
          <MobileSearch>
            <IconMobileSearch icon={faSearch} onClick={onFocusTwitterSearch}></IconMobileSearch>
          </MobileSearch>
          <MobileDarkMode type="button" onClick={changeTheme}>
            {isDark ? "🌙" : "🌞"}
          </MobileDarkMode>
        </MobileMenu>
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
