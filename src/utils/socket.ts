import { io } from "socket.io-client";

export const socket = io("https://turnosya-backend.onrender.com", {
  transports: ["websocket"],
  upgrade: false,
  withCredentials: true,
  reconnection: false
});

