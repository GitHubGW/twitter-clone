import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}
  :root{
    --twitter-color: #1DA1F2;
    --twitter-dark-color: rgb(26, 140, 216);
  }
  body{
    background-color: ${(props) => (props.bgColor === true ? "#18191A" : "#ffffff")};
    color: ${(props) => (props.color === true ? "#cccccc" : "#31302E")};
    border-color: ${(props) => (props.borderCcolor === true ? "#2c2d33" : "#eaeaea")};
    display:flex;
    justify-content:center;
  }
  button{
    border:none;
    outline:none;
    cursor: pointer;
  }
  a{
    text-decoration:none;
  }
  a:focus, a:visited{
    /* color:inherit; */
  }
`;

export default GlobalStyle;
