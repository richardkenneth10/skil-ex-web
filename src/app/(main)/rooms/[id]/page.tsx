import RoomFragment from "@/components/room/room-fragment";
import { Metadata } from "next";
import { use } from "react";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function RoomsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <RoomFragment id={id} />;
}
