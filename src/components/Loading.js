import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const LoadingContainer = styled.section`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingIcon = styled(FontAwesomeIcon)`
  font-size: 40px;
  color: #1da1f2;
`;

const LoadingTitle = styled.h1`
  font-size: 16px;
  color: #1da1f2;
`;

const Loading = () => {
  return (
    <LoadingContainer>
      <LoadingIcon icon={faTwitter}></LoadingIcon>
      <LoadingTitle>Loading...</LoadingTitle>
    </LoadingContainer>
  );
};

export default Loading;
