import { io } from "socket.io-client";

export const socket = io("https://turnosya-backend.onrender.com/socket.io")