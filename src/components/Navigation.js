import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/profile">프로필</Link>
        </li>
      </ul>
    </>
  );
};

export default Navigation;
