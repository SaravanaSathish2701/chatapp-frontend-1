/* eslint-disable react/prop-types */
const MessageSelf = ({ props }) => {
  return (
    <div className="self-message-container">
      <div className="messageBox">
        <p style={{ color: "black" }}>{props.content}</p>
      </div>
    </div>
  );
};

export default MessageSelf;
