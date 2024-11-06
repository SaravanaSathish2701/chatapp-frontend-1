import { useSelector } from "react-redux";
import logo from "/Images/live-chat_512px.png";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);

  const nav = useNavigate();
  if (!userData) {
    console.log("User not authenticated");
    nav("/");
    return null; // Return null to avoid rendering if data is missing
  }

  return (
    <div className={"welcome-container" + (lightTheme ? "" : " dark")}>
      <img src={logo} alt="logo" className="welcome-logo" />
      <b>Hi , {userData.data.name} 👋</b>
      <p>View and text directly to people present in the chat room.</p>
    </div>
  );
};

export default Welcome;
