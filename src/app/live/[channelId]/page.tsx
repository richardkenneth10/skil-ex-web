import { SignalingUser } from "@/app/interfaces/user/user";
import LiveFragment from "@/components/live/live-fragment";
import axios from "@/utils/server-axios";
import { Metadata } from "next";

export type StreamInfoResData = {
  user: SignalingUser;
  channel: { users: SignalingUser[] } | null;
};

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default async function LivePage({
  params,
}: {
  params: Promise<{ channelId: string }>;
}) {
  const { channelId } = await params;

  const res = await axios.get(`/streams/${channelId}/live-info`);
  const streamInfo: StreamInfoResData = res.data;

  console.log(streamInfo);

  return <LiveFragment channelId={channelId} streamInfo={streamInfo} />;
}
