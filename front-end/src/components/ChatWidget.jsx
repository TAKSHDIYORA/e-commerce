import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";

const ChatWidget = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [adminIn, setAdminIn] = useState(false);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    // 🔌 When connected to backend
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    // 🕓 Load chat history from backend
   socket.on("chat_history", ({ sessionId, history }) => {
      console.log("Chat history received:", sessionId);
      setSessionId(sessionId);
      setMessages(history || []);
    });

    // 🆕 New message event
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // 👨‍💼 Admin joined the chat
    socket.on("admin_joined", () => {
      setAdminIn(true);
      setWaiting(false);
    });

    // 🚫 Chat closed by admin
    socket.on("chat_closed", () => {
      alert("Admin has closed the chat.");
      localStorage.removeItem("chat_sessionId")
      setChatStarted(false);
      setAdminIn(false);
      setSessionId(null);
      setMessages([]);
    });

    // 🧹 Cleanup on unmount
    return () => {
  socket.off("chat_history");
      socket.off("receive_message");
      socket.off("admin_joined");
      socket.off("chat_closed");
        };
  }, []);


  useEffect(() => {
  const savedSession = localStorage.getItem("chat_sessionId");
  if (savedSession) {
    setSessionId(savedSession);
    setChatStarted(true);
    socket.emit("start_chat", { userId }); // triggers chat_history again
  }
}, []);

useEffect(() => {
  if (sessionId) {
    localStorage.setItem("chat_sessionId", sessionId);
  }
}, [sessionId]);


  const startChat = () => {
    socket.emit("start_chat", { userId });
    setChatStarted(true);
    setWaiting(true);

    // // Wait for session ID assignment (we get it through chat_history)
    // socket.once("chat_history", (history) => {
    //   if (history.length > 0) setSessionId(history[0].sessionId);
    // });
  };

  const sendMessage = () => {
    if (message.trim() && sessionId) {
      socket.emit("send_message", { sessionId, sender: "user", message });
      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-xl p-4 w-80 border border-gray-200">
      {!chatStarted ? (
        <button
          onClick={startChat}
          className="bg-yellow-500 hover:bg-yellow-600 transition w-full py-2 text-white rounded-lg font-semibold"
        >
          💬 Chat with Us
        </button>
      ) : (
        <>
          {waiting && !adminIn ? (
            <div className="text-center text-gray-500 font-medium py-20">
              Waiting for admin to join...
            </div>
          ) : (
            <>
              <div className="h-60 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 my-1 rounded-lg max-w-[80%] ${
                      msg.sender === "user"
                        ? "ml-auto bg-yellow-100 text-right"
                        : "mr-auto bg-blue-100 text-left"
                    }`}
                  >
                    {msg.message}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="border flex-1 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-yellow-500"
                />
                <button
                  onClick={sendMessage}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ChatWidget;
