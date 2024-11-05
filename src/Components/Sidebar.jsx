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

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const { refresh } = useContext(myContext);  // Only listen for refresh
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
      if (!userData) return;
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };

      try {
        setLoading(true);
        const response = await axios.get(
          "https://chatapp-backend-1-azi4.onrender.com/chat/",
          config
        );
        console.log("Fetched conversations:", response.data); // Debugging log
        setConversations(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching conversations:", err);
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
    const otherUser = conversation.users.find((u) => u._id !== userData.data._id);
    const userName = otherUser ? otherUser.name : "Unknown User";

    return (
      <div
        onClick={() => navigate(`chat/${conversation._id}&${userName}`)}
        className={`conversation-item${lightTheme ? "" : " dark"}`}
        key={conversation._id}
      >
        <p className={`con-icon${lightTheme ? "" : " dark"}`}>{userName[0]}</p>
        <p className={`con-title${lightTheme ? "" : " dark"}`}>{userName}</p>
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
      <div className={`sb-header${lightTheme ? "" : " dark"}`}>
        <div className="other-icons">
          <IconButton onClick={() => navigate("/app/welcome")}>
            <AccountCircleIcon className={`icon${lightTheme ? "" : " dark"}`} />
          </IconButton>
          <IconButton onClick={() => navigate("users")}>
            <PersonAddIcon className={`icon${lightTheme ? "" : " dark"}`} />
          </IconButton>
          <IconButton onClick={() => navigate("groups")}>
            <GroupAddIcon className={`icon${lightTheme ? "" : " dark"}`} />
          </IconButton>
          <IconButton onClick={() => navigate("create-groups")}>
            <AddCircleIcon className={`icon${lightTheme ? "" : " dark"}`} />
          </IconButton>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {lightTheme ? (
              <NightlightIcon className={`icon${lightTheme ? "" : " dark"}`} />
            ) : (
              <LightModeIcon className={`icon${lightTheme ? "" : " dark"}`} />
            )}
          </IconButton>
          <IconButton onClick={handleLogout}>
            <ExitToAppIcon className={`icon${lightTheme ? "" : " dark"}`} />
          </IconButton>
        </div>
      </div>
      <div className={`sb-search${lightTheme ? "" : " dark"}`}>
        <IconButton className={`icon${lightTheme ? "" : " dark"}`}>
          <SearchIcon />
        </IconButton>
        <input
          placeholder="Search"
          className={`search-box${lightTheme ? "" : " dark"}`}
        />
      </div>
      <div className={`sb-conversations${lightTheme ? "" : " dark"}`}>
        {error && <div>Error: {error}</div>}
        {loading ? (
          <div>Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div>No conversations available.</div>
        ) : (
          conversations.map((conversation) => renderConversation(conversation))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
