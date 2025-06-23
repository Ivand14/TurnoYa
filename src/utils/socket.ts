// import { io } from "socket.io-client";

// export const socket = io("ws://turnosya-backend.onrender.com", {
//   transports: ["websocket"],
//   upgrade: false,
//   withCredentials: true,
//   reconnection: true
// });

import client from "socket.io-client"

const socketuri = "https://turnosya-backend.onrender.com"; 
export const socket = client(socketuri);

console.log(socket);