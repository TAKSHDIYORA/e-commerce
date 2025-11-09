import { io } from "socket.io-client";
import { backendUrl } from "../App";
// backend URL
export const socket = io(`${backendUrl}`, {
  transports: ["websocket"],
});
