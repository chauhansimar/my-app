import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import { sendMessage } from "../services/api";

import "../styles/Chatbot.css";

function Chatbot() {

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const chatEndRef = useRef(null);
  const user = JSON.parse(
  localStorage.getItem("user")
);

  const handleSend = async () => {

    if (!message.trim()) return;

const userMsg = {
  role: "user",
  text: message,

  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
};

    setChat((prev) => [...prev, userMsg]);

    setLoading(true);

    try {

      const res = await sendMessage(message);

const botMsg = {
  role: "bot",
  text: res.reply,

  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
};

      setChat((prev) => [...prev, botMsg]);

    } catch (error) {

      console.log(error);

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went wrong.",
        },
      ]);
    }

    setLoading(false);

    setMessage("");
  };

  // AUTO SCROLL
  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [chat]);
  const clearChat = () => {
  setChat([]);
};
const handleLogout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("user");

  window.location.href = "/login";
};

  return (
    <div className="chat-wrapper">

      <div className="chat-box-container">

<div className="chat-header">

  <span>AI Assistant</span>

  <button
    className="clear-btn"
    onClick={clearChat}
  >
    Clear
  </button>

</div>

        <div className="chat-container">

          {chat.map((msg, i) => (
<div
  key={i}
  className={`chat-bubble ${msg.role}`}
>

  <p>{msg.text}</p>

  <span className="chat-time">
    {msg.time}
  </span>

</div>
          ))}

          {/* BOT TYPING */}
          {loading && (
            <div className="chat-bubble bot typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={chatEndRef}></div>

        </div>

        <div className="chat-input-area">

          <input
            type="text"
            value={message}
            placeholder="Type your message..."
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                message.trim()
              ) {
                handleSend();
              }
            }}
          />

          <button onClick={handleSend}>
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default Chatbot;