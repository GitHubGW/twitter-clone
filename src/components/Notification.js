import { NotificationManager } from "react-notifications";

// 플래시 메세지
export const createNotification = (type) => {
  switch (type) {
    case "SuccessRegister":
      NotificationManager.success("계정 생성을 성공하였습니다.", "성공", 1200);
      break;
    case "SuccessLogin":
      NotificationManager.success("이메일 로그인에 성공하였습니다.", "성공", 1200);
      break;
    case "FailLogin":
      NotificationManager.error("로그인에 실패하였습니다.", "실패", 1200);
      break;
    case "SuccessGoogleLogin":
      NotificationManager.success("구글 로그인에 성공하였습니다.", "성공", 1200);
      break;
    case "FailGoogleLogin":
      NotificationManager.error("구글 로그인에 실패하였습니다.", "실패", 1200);
      break;
    case "SuccessGithubLogin":
      NotificationManager.success("깃허브 로그인에 성공하였습니다.", "성공", 1200);
      break;
    case "FailGithubLogin":
      NotificationManager.error("깃허브 로그인에 실패하였습니다.", "실패", 1200);
      break;
    case "SuccessLogout":
      NotificationManager.success("로그아웃 되었습니다.", "성공", 1200);
      break;
    case "NotLogin":
      NotificationManager.error("로그인 후 이용 가능합니다.", "실패", 1600);
      break;
    case "SuccessPostTweet":
      NotificationManager.success("트윗을 작성하였습니다.", "성공", 1500);
      break;
    case "SuccessEditTweet":
      NotificationManager.success("트윗을 수정하였습니다.", "성공", 1500);
      break;
    case "SuccessDeleteTweet":
      NotificationManager.success("트윗을 삭제하였습니다.", "성공", 1500);
      break;
    case "SuccessProfile":
      NotificationManager.success("프로필을 업데이트하였습니다.", "성공", 1500);
      break;
    case "SuccessChangePassword":
      NotificationManager.success("비밀번호를 변경하였습니다.", "성공", 1500);
      break;
    case "SuccessChangeEmail":
      NotificationManager.success("이메일을 변경하였습니다.", "성공", 1500);
      break;
    case "FailChangePassword":
      NotificationManager.error("비밀번호 변경을 실패하였습니다.", "실패", 1600);
      break;
    case "FailChangeEmail":
      NotificationManager.error("이메일 변경을 실패하였습니다.", "실패", 1600);
      break;
    case "info":
      NotificationManager.info("info message", "info", 1500);
      break;
    case "warning":
      NotificationManager.warning("Warning message", "Warning", 1500);
      break;
    case "error":
      NotificationManager.error("Error message", "Error", 1500, () => {
        alert("callback");
      });
      break;
    default:
      break;
  }
};
