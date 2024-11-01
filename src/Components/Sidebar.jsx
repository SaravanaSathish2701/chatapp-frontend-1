import { useContext, useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LightModeIcon from "@mui/icons-material/LightMode";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/themeSlice";
import axios from "axios";
import { myContext } from "./MainContainer";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const { refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (!userData) {
      console.log("User not Authenticated");
      navigate("/");
    }
  }, [navigate, userData]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!userData) return; // Ensure userData is available
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };

      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/chat/", config);
        setConversations(response.data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [refresh, userData]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  const renderConversation = (conversation) => {
    const user = conversation.users[1]?.name || "Unknown User"; // Optional chaining to avoid errors

    return (
      <div
        onClick={() => {
          setRefresh(!refresh);
          navigate(`chat/${conversation._id}&${user}`);
        }}
        className={"conversation-item" + (lightTheme ? "" : " dark")}
      >
        <p className={"con-icon" + (lightTheme ? "" : " dark")}>{user[0]}</p>
        <p className={"con-title" + (lightTheme ? "" : " dark")}>{user}</p>
        <p className="con-lastMessage">
          {conversation.latestMessage
            ? conversation.latestMessage.content
            : "No previous Messages, click here to start a new chat"}
        </p>
      </div>
    );
  };

  return (
    <div className="sidebar-container">
      <div className={"sb-header" + (lightTheme ? "" : " dark")}>
        <div className="other-icons">
          <IconButton onClick={() => navigate("/app/welcome")}>
            <AccountCircleIcon
              className={"icon" + (lightTheme ? "" : " dark")}
            />
          </IconButton>
          <IconButton onClick={() => navigate("users")}>
            <PersonAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
          <IconButton onClick={() => navigate("groups")}>
            <GroupAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
          <IconButton onClick={() => navigate("create-groups")}>
            <AddCircleIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {lightTheme ? (
              <NightlightIcon
                className={"icon" + (lightTheme ? "" : " dark")}
              />
            ) : (
              <LightModeIcon className={"icon" + (lightTheme ? "" : " dark")} />
            )}
          </IconButton>
          <IconButton onClick={handleLogout}>
            <ExitToAppIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
        </div>
      </div>
      <div className={"sb-search" + (lightTheme ? "" : " dark")}>
        <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
          <SearchIcon />
        </IconButton>
        <input
          placeholder="Search"
          className={"search-box" + (lightTheme ? "" : " dark")}
        />
      </div>
      <div className={"sb-conversations" + (lightTheme ? "" : " dark")}>
        {error && <div>Error: {error}</div>}
        {conversations.length === 0 && <div>No conversations available.</div>}
        {conversations.map((conversation) => (
          <div key={conversation._id} className="conversation-container">
            {renderConversation(conversation)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
