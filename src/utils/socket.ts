import { Message } from "@/components/room/room-fragment";
import { io } from "socket.io-client";
import Constants from "./constants";

const socket = io(`${Constants.apiBaseUrl}/chat`, {
  transports: ["websocket"],
});

export const joinRoomChat = (roomId: number) => {
  socket.emit("join-exchange-room-chat", roomId);
};

export const subscribeToRoomChat = (callback: (m: Message) => void) => {
  socket.on("receive-exchange-room-chat-message", callback);
};

export const unsubscribeToRoomChat = () => {
  socket.off("receive-exchange-room-chat-message");
};

export const emitRoomMessage = (data: { roomId: number; content: string }) => {
  socket.emit("send-exchange-room-chat-message", data);
};

export default socket;
