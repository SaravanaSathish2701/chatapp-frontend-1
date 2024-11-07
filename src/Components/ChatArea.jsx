import { useContext, useEffect, useRef, useState } from "react";
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

  // Function to fetch chat messages
  const fetchMessages = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    try {
      const { data } = await axios.get(
        `https://chatapp-backend-1-azi4.onrender.com/message/${chat_id}`,
        config
      );
      setAllMessages(data);
      setLoaded(true);
      scrollToBottom(); // Scroll after messages are loaded
    } catch (error) {
      console.error(
        "Error fetching messages:",
        error.response?.data || error.message
      );
      setLoaded(true);
    }
  };

  // Function to send a message
  const sendMessage = async () => {
    if (!messageContent.trim()) return;

    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    try {
      await axios.post(
        "https://chatapp-backend-1-azi4.onrender.com/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      );
      setMessageContent("");
      setRefresh((prev) => !prev); // Refresh to fetch new messages
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    }
  };

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages when component mounts or refresh changes
  useEffect(() => {
    fetchMessages();
  }, [refresh, chat_id]);

  // Scroll to bottom on messages update
  useEffect(() => {
    if (loaded) {
      scrollToBottom();
    }
  }, [allMessages, loaded]);

  // Render loading state
  if (!loaded) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
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
    <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
      <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
        <p className={"con-icon" + (lightTheme ? "" : " dark")}>
          {chat_user[0]}
        </p>
        <div className={"list-item" + (lightTheme ? "" : " dark")}>
          
          <p className={"con-title" + (lightTheme ? "" : " dark")}>
            {chat_user}
          </p>
        </div>
        <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
          <DeleteIcon />
        </IconButton>
      </div>
      <div className={"messages-container" + (lightTheme ? "" : " dark")}>
        {allMessages.length === 0 ? (
          <p>No messages yet</p>
        ) : (
          allMessages
            .slice(0)
            .reverse()
            .map((message) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              return sender._id === self_id ? (
                <MessageSelf props={message} key={message._id} />
              ) : (
                <MessageOthers props={message} key={message._id} />
              );
            })
        )}
      </div>
      <div ref={messagesEndRef} className="BOTTOM" />
      <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
        <input
          placeholder="Type a Message"
          className={"search-box" + (lightTheme ? "" : " dark")}
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              sendMessage();
            }
          }}
        />
        <IconButton
          className={"icon" + (lightTheme ? "" : " dark")}
          onClick={sendMessage}
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ChatArea;    