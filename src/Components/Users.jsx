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

const Users = () => {
  const { refresh } = useContext(myContext);
  const lightTheme = useSelector((state) => state.themeKey);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!userData) {
    console.log("User not Authenticated");
    navigate(-1);
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };
      try {
        const { data } = await axios.get(
          "https://chatapp-backend-1-azi4.onrender.com/user/fetchUsers",
          config
        );
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [userData, refresh]);

  const handleCreateChat = async (userId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    try {
      await axios.post(
        "https://chatapp-backend-1-azi4.onrender.com/chat/",
        { userId },
        config
      );
      console.log("Chat created with user ID:", userId);
      dispatch(refreshSidebarFun());
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-container">
      <div className={`ug-header ${lightTheme ? "" : " dark"}`}>
        <img
          src={logo}
          alt="Logo"
          style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
        />
        <p className={`ug-title ${lightTheme ? "" : " dark"}`}>
          Available Users
        </p>
        <IconButton
          className={`icon ${lightTheme ? "" : " dark"}`}
          onClick={() => {
            setUsers([]);
            setSearchTerm("");
          }}
        >
          <RefreshIcon />
        </IconButton>
      </div>
      <div className={`sb-search ${lightTheme ? "" : " dark"}`}>
        <IconButton className={`icon ${lightTheme ? "" : " dark"}`}>
          <SearchIcon />
        </IconButton>
        <input
          placeholder="Search"
          className={`search-box ${lightTheme ? "" : " dark"}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="ug-list">
        {filteredUsers.length === 0 ? (
          <div>No users available. Try refreshing or searching.</div>
        ) : (
          filteredUsers.map((user) => (
            <div
              className={`list-item ${lightTheme ? "" : " dark"}`}
              key={user._id}
              onClick={() => handleCreateChat(user._id)}
            >
              <p className={`con-icon ${lightTheme ? "" : " dark"}`}>
                {user.name[0].toUpperCase()}
              </p>
              <p className={`con-title ${lightTheme ? "" : " dark"}`}>
                {user.name}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
