import { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "/Images/live-chat_512px.png";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

const Groups = () => {
  const { refresh, setRefresh } = useContext(myContext);
  const lightTheme = useSelector((state) => state.themeKey);
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();

  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData?.data || {};

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      try {
        const { data } = await axios.get(
          "https://chatapp-backend-1-azi4.onrender.com/chat/fetchGroups",
          config
        );
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [refresh]);

  const filteredGroups = groups.filter((group) =>
    group.chatName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-container">
      <div className={`ug-header ${lightTheme ? "" : "dark"}`}>
        <img
          src={logo}
          alt="Logo"
          style={{ height: "2rem", marginLeft: "10px" }}
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
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="ug-list">
          {filteredGroups.length === 0 ? (
            <div>No groups available. Try refreshing or searching.</div>
          ) : (
            filteredGroups.map((group, index) => (
              <div
                className={`list-item ${lightTheme ? "" : "dark"}`}
                key={index}
                onClick={() => {
                  nav(`/chat/${group._id}`);
                  dispatch(refreshSidebarFun());
                }}
              >
                <p className={`con-icon ${lightTheme ? "" : "dark"}`}>
                  {group.chatName[0]}
                </p>
                <p className={`con-title ${lightTheme ? "" : "dark"}`}>
                  {group.chatName}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Groups;
