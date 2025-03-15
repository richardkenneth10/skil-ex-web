import { Message } from "@/components/room/room-fragment";
import { io } from "socket.io-client";
import Constants from "./constants";

const socket = io(`${Constants.apiBaseUrl}/chat`, {
  transports: ["websocket"],
});

export const joinRoomChat = async (roomId: number) => {
  return await new Promise<{
    ongoingStreamSession: { channelId: string } | null;
  }>((r) => socket.emit("join-exchange-room-chat", roomId, r));
};

export const subscribeToStreamStarted = (
  callback: (channelId: string) => void
) => {
  socket.on("stream-started", callback);
};

export const subscribeToStreamEnded = (
  callback: (channelId: string, endedAt: Date) => void
) => {
  socket.on("stream-ended", callback);
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
