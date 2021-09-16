import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}

  :root{
    --twitter-color: #1DA1F2;
    --twitter-dark-color: #00AFF0;
  }
  html{
    scroll-behavior: smooth;
  }
  body{
    background-color: ${(props) => (props.bgColor === true ? "#18191A" : "#ffffff")};
    color: ${(props) => (props.color === true ? "#cccccc" : "#31302E")};
    border-color: ${(props) => (props.borderCcolor === true ? "#2c2d33" : "#eaeaea")};
    display:flex;
    justify-content:center;
    position:relative;
  }
  #root.active::before{
    content:"";
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100vh;
    background-color:rgba(0,0,0,0.6);
    z-index: 5;
  }
  button{
    border:none;
    outline:none;
    cursor: pointer;
    background-color:transparent;
    padding:0;
  }
  a{
    text-decoration:none;
  }
  a:focus, a:visited{
    /* color:inherit; */
  }
  aside.emoji-picker-react{
    position:absolute;
    top:42px;
  }
`;

export default GlobalStyle;
