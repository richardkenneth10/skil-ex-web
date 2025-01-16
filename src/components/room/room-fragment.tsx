import { IMiniUser } from "@/app/interfaces/user/user";
import axios from "@/utils/server-axios";
import ClientCookie from "../(main)/client-cookie";
import ClientRoomFragment from "./client-room-fragment";

export type RoomMsgsResData = {
  messages: Message[];
  skillMatch: SkillMatch;
};

export type SkillMatch = {
  userSkill: { name: string };
  otherUser: IMiniUser;
  otherUserSkill: { name: string };
};

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
  const res = await axios.get(
    `/chats/exchange-room-messages/${id}?includeSkillMatch=true`
  );
  const { messages, skillMatch }: RoomMsgsResData = res.data;

  return (
    <>
      <ClientCookie cookie={res.headers["set-cookie"]} />
      <ClientRoomFragment messages={messages} skillMatch={skillMatch} />
    </>
  );
}
