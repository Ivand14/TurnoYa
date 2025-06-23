import { io } from "socket.io-client";

export const socket = io("https://turnosya-backend.onrender.com", {
  transports: ["websocket"],
  upgrade: false,
  withCredentials: true,
  reconnection: false
});

const ws = new WebSocket("wss://turnosya-backend.onrender.com/socket.io/?EIO=4&transport=websocket");
ws.onopen = () => console.log("🟢 WebSocket activo con Gevent");
ws.onerror = (e) => console.error("❌ Falla WebSocket con Gevent:", e);

const newweb = new WebSocket("wss://turnosya-backend.onrender.com/socket.io/?EIO=4&transport=websocket")

console.log(newweb);
