import { useHistory } from "react-router-dom";
import { authService } from "firebaseConfiguration";

const Profile = () => {
  const history = useHistory();

  const onClickLogOut = async () => {
    const currentUser = authService.currentUser;

    if (currentUser) {
      await authService.signOut();
      history.push("/");
    }
  };

  return (
    <>
      <h1>Profile</h1>
      <button onClick={onClickLogOut}>로그아웃</button>
    </>
  );
};

export default Profile;
