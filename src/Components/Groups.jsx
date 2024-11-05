import { useContext, useEffect, useState } from "react";
import "./myStyles.css";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import logo from "/Images/live-chat_512px.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

const Groups = () => {
  const { refresh, setRefresh } = useContext(myContext);
  const lightTheme = useSelector((state) => state.themeKey);
  const dispatch = useDispatch();
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();

  // Check if the user is authenticated
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData.data;

  // Fetch groups from the backend whenever refresh or user token changes
  useEffect(() => {
    const fetchGroups = async () => {
      console.log("Fetching groups for user with token:", user.token);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      try {
        const response = await axios.get(
          "https://chatapp-backend-1-azi4.onrender.com/chat/fetchGroups",
          config
        );
        console.log("Group Data from API:", response.data);
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, [refresh, user.token]);

  // Filter groups based on search term
  const filteredGroups = groups.filter((group) =>
    group.chatName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-container">
      <div className={`ug-header ${lightTheme ? "" : "dark"}`}>
        <img
          src={logo}
          alt="Logo"
          style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
        />
        <p className={`ug-title ${lightTheme ? "" : "dark"}`}>
          Available Groups
        </p>
        <IconButton
          className={`icon ${lightTheme ? "" : "dark"}`}
          onClick={() => setRefresh(!refresh)}
        >
          <RefreshIcon />
        </IconButton>
      </div>
      <div className={`sb-search ${lightTheme ? "" : "dark"}`}>
        <IconButton className={`icon ${lightTheme ? "" : "dark"}`}>
          <SearchIcon />
        </IconButton>
        <input
          placeholder="Search"
          className={`search-box ${lightTheme ? "" : "dark"}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="ug-list">
        {filteredGroups.length === 0 && (
          <div>No groups available. Try refreshing or searching.</div>
        )}
        {filteredGroups.map((group, index) => (
          <div
            className={`list-item ${lightTheme ? "" : "dark"}`}
            key={index}
            onClick={() => {
              console.log("Navigating to chat with group:", group);
              // Assuming the group object contains an _id or some identifier
              nav(`/chat/${group._id}`); 
              dispatch(refreshSidebarFun());
            }}
          >
            <p className={`con-icon ${lightTheme ? "" : "dark"}`}>T</p>
            <p className={`con-title ${lightTheme ? "" : "dark"}`}>
              {group.chatName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
