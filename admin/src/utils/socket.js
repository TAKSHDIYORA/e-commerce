import { io } from "socket.io-client";

// backend URL
export const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});
