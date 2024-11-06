import { useContext, useEffect, useRef, useState, useCallback } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";

function ChatArea() {
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef(null);
  const { _id } = useParams();
  const [chat_id, chat_user] = _id.split("&");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setLoaded] = useState(false);

  const fetchMessages = useCallback(async () => {
    const config = {
      headers: { Authorization: `Bearer ${userData.data.token}` },
    };
    try {
      const { data } = await axios.get(
        `https://chatapp-backend-1-azi4.onrender.com/message/${chat_id}`,
        config
      );
      setAllMessages(data);
      setLoaded(true);
      scrollToBottom();
    } catch (error) {
      console.error(
        "Error fetching messages:",
        error.response?.data || error.message
      );
      setLoaded(true);
    }
  }, [chat_id, userData.data.token]);

  const sendMessage = async () => {
    if (!messageContent.trim()) return;

    const config = {
      headers: { Authorization: `Bearer ${userData.data.token}` },
    };
    try {
      await axios.post(
        "https://chatapp-backend-1-azi4.onrender.com/message/",
        { content: messageContent, chatId: chat_id },
        config
      );
      setMessageContent("");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, refresh, chat_id]);

  useEffect(() => {
    if (loaded) scrollToBottom();
  }, [allMessages.length, loaded]);

  if (!loaded) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px", flexGrow: "1" }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  }

  return (
    <div className={`chatArea-container ${lightTheme ? "" : " dark"}`}>
      {/* Chat Header */}
      <div className={`chatArea-header ${lightTheme ? "" : " dark"}`}>
        <p className={`con-icon ${lightTheme ? "" : " dark"}`}>
          {chat_user[0]}
        </p>
        <div className={`header-text ${lightTheme ? "" : " dark"}`}>
          <p className={`con-title ${lightTheme ? "" : " dark"}`}>
            {chat_user}
          </p>
        </div>
        <IconButton className={`icon ${lightTheme ? "" : " dark"}`}>
          <DeleteIcon />
        </IconButton>
      </div>

      {/* Messages Container */}
      <div className={`messages-container ${lightTheme ? "" : " dark"}`}>
        {allMessages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          allMessages
            .slice(0)
            .reverse()
            .map((message) => {
              const self_id = userData.data._id;
              return message.sender._id === self_id ? (
                <MessageSelf props={message} key={message._id} />
              ) : (
                <MessageOthers props={message} key={message._id} />
              );
            })
        )}
      </div>
      <div ref={messagesEndRef} className="BOTTOM" />

      {/* Input Area */}
      <div className={`text-input-area ${lightTheme ? "" : " dark"}`}>
        <input
          placeholder="Type a Message"
          className={`search-box ${lightTheme ? "" : " dark"}`}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
        />
        <IconButton
          className={`icon ${lightTheme ? "" : " dark"}`}
          onClick={sendMessage}
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ChatArea;
