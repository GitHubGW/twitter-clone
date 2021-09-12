import { Link } from "react-router-dom";

const Navigation = ({ userObject }) => {
  console.log("Navi userObject", userObject);

  return (
    <>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/profile">{userObject && userObject.displayName ? userObject.displayName : "유저"}의 프로필</Link>
        </li>
      </ul>
    </>
  );
};

export default Navigation;
