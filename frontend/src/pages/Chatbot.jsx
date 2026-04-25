import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Show welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "👮 Hello! I am your Cyber Safety Assistant. How can I help you today?"
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chatbot",
        { message }
      );

      const botMessage = {
        sender: "bot",
        text: res.data.reply
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "⚠ Server error. Please try again." }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating AI Button */}
      <div className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        <img src="/ai.jpeg" alt="AI Assistant" className="chat-icon-img" />
      </div>

      {isOpen && (
        <div className="chat-container">

          {/* Header */}
          <div className="chat-header">
            <img src="/ai.jpeg" alt="AI" className="header-avatar" />
            <span>Cyber Safety Assistant</span>
          </div>

          {/* Body */}
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="chat-message bot typing">
                Typing...
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* Footer */}
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Ask about cyber safety..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>

        </div>
      )}
    </>
  );
}

export default Chatbot;