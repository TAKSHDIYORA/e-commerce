import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import axios from "axios";

import {backendUrl} from '../App'
const CustomerService = () => {
  const [waitingCustomers, setWaitingCustomers] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

useEffect(() => {
  localStorage.setItem("messages", JSON.stringify(messages));
}, [messages]);

useEffect(() => {
  localStorage.setItem("activeSession", activeSession || "");
}, [activeSession]);

useEffect(() => {
  const savedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
  const savedSession = localStorage.getItem("activeSession") || null;

  if (savedSession) {
    setActiveSession(savedSession);
    setMessages(savedMessages);
    socket.emit("admin_joined", { sessionId: savedSession }); // 🟢 reconnect to that chat room
  }
}, []);

useEffect(() => {
  axios.get(`${backendUrl}/api/chat/sessions`)
    .then(res => setWaitingCustomers(res.data))
    .catch(err => console.error(err));
}, []);
useEffect(() => {
  const fetchSessions = async () => {
    const { data } = await axios.get(`${backendUrl}/api/chat/sessions`);
    setWaitingCustomers(data);
  };
  fetchSessions();
  const interval = setInterval(fetchSessions, 5000);
  return () => clearInterval(interval);
}, []);







  useEffect(() => {
 socket.on("customer_waiting", (session) => {
  if (!session || !session._id) return;
  setWaitingCustomers((prev) => {
    const safePrev = Array.isArray(prev) ? prev : [];
    const exists = safePrev.some((s) => s._id === session._id);
    return exists ? safePrev : [...safePrev, session];
  });
});


 socket.on("chat_history", ({ sessionId, history }) => {
  setMessages(history || []);
  setActiveSession(sessionId);
});

    // --- When a new message is received
 socket.on("receive_message", (msg) => {
  setMessages((prev) => {
    const safePrev = Array.isArray(prev) ? prev : [];
    return [...safePrev, msg];
  });
});


    // --- When a chat is closed
    socket.on("chat_closed", ({ sessionId }) => {
  setActiveSession(null);
  setMessages([]);
  setWaitingCustomers((prev) =>
    prev.filter((cust) => cust._id !== sessionId)
  );
});

    // Cleanup listeners on unmount
    return () => {
     socket.off("customer_waiting");
socket.off("chat_history");
socket.off("receive_message");
socket.off("chat_closed");

    };
  }, []);

  // --- Join a customer's chat
  const joinChat = (sessionId) => {
    socket.emit("admin_joined", { sessionId });
    setActiveSession(sessionId);
  };

  // --- Send message to the chat
  const sendMessage = () => {
    if (message.trim() && activeSession) {
      socket.emit("send_message", {
        sessionId: activeSession,
        sender: "admin",
        message,
      });
      setMessage("");
    }
  };

  // --- Close the current chat
  const closeChat = () => {
    if (activeSession) {
      socket.emit("close_chat", { sessionId: activeSession });
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold mb-4">🧑‍💻 Customer Service</h1>

      <div className="flex gap-5">
        {/* Waiting customers list */}
        <div className="w-1/3 bg-gray-100 p-3 rounded">
          <h2 className="font-semibold mb-2">Waiting Customers</h2>
          {waitingCustomers.length === 0 ? (
            <p className="text-gray-500 text-sm">No waiting customers</p>
          ) : (
            waitingCustomers.map((cust) => (
              <div
                key={cust._id}
                className="p-2 border-b flex justify-between items-center"
              >
                {
                    (cust.userId=== "690f17807fe405fe0c304e44") ?   <span>{cust.userId}</span> :  <span>guest</span>
                }
               
                <button
                  onClick={() => joinChat(cust._id)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Join Chat
                </button>
              </div>
            ))
          )}
        </div>

        {/* Active chat window */}
        <div className="w-2/3 bg-white p-3 rounded shadow">
          {activeSession ? (
            <>
              <div className="h-64 overflow-y-auto border mb-3 p-2 bg-gray-50 rounded">
                {messages.length === 0 && (
                  <p className="text-center text-gray-500 text-sm">
                    No messages yet
                  </p>
                )}
              {Array.isArray(messages) && messages.length > 0 ? (
  messages.map((msg, idx) => (
    <div
      key={idx}
      className={`my-1 ${
        msg.sender === "admin"
          ? "text-right text-blue-700"
          : "text-left text-gray-700"
      }`}
    >
      <b>{msg.sender}:</b> {msg.message}
    </div>
  ))
) : (
  <p className="text-center text-gray-500 text-sm">No messages yet</p>
)}
              </div>

              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border flex-1 px-2 rounded"
                  placeholder="Type message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 rounded"
                >
                  Send
                </button>
                <button
                  onClick={closeChat}
                  className="bg-red-600 text-white px-4 rounded"
                >
                  Close Chat
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a customer to start chat</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerService;
