import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}
  body{
    background-color: ${(props) => (props.bgColor === true ? "#18191A" : "#ffffff")};
    color: ${(props) => (props.color === true ? "#cccccc" : "#31302E")};
    border-color: ${(props) => (props.borderCcolor === true ? "#2c2d33" : "#eaeaea")};
  }
`;

export default GlobalStyle;
