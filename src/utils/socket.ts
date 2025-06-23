import { io } from "socket.io-client";

export const socket = io("http://0.0.0.0:10000", {
  withCredentials: true,
  transports: ["websocket"]
});


