import { IMiniUser } from "@/app/interfaces/user/user";
import Constants from "@/utils/constants";
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
  id: number;
  type: "TEXT" | "LIVE";
  textMessage?: TextMessage;
  liveMessage?: LiveMessage;
  sender: {
    id: number;
    name: string;
    bio: string | null;
    avatarUrl: string | null;
  };
  createdAt: string;
  updatedAt: string;
  senderId: number;
  exchangeRoomId: number;
};

type TextMessage = {
  id: number;
  text: string;
};

type LiveMessage = {
  id: number;
  channelId: string;
  session: MiniSession;
};

type MiniSession = { startedAt: Date; endedAt?: Date };

export default async function RoomFragment({ id }: { id: string }) {
  const res = await axios.get(
    `/chats/exchange-room-messages/${id}?includeSkillMatch=true`
  );
  const { messages, skillMatch }: RoomMsgsResData = res.data;

  return (
    <>
      <ClientCookie
        tokensJSONString={res.config.headers[Constants.authTokensHeaderKey]}
      />
      <ClientRoomFragment messages={messages} skillMatch={skillMatch} />
    </>
  );
}
