import { IMiniUser } from "@/app/interfaces/user/user";
import axios from "@/utils/server-axios";
import ClientCookie from "../(main)/client-cookie";
import ClientRoomFragment from "./client-room-fragment";

type ResData = { messages: Message[]; otherUser: IMiniUser };

export type Message = {
  sender: {
    id: number;
    name: string;
    bio: string | null;
    avatarUrl: string | null;
  };
  id: number;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  content: string;
  exchangeRoomId: number;
};

export default async function RoomFragment({ id }: { id: string }) {
  const res = await axios.get(`/chats/exchange-room-messages/${id}`);
  const { messages, otherUser }: ResData = res.data;

  return (
    <>
      <ClientCookie cookie={res.headers["set-cookie"]} />
      <ClientRoomFragment messages={messages} otherUser={otherUser} />
    </>
  );
}
