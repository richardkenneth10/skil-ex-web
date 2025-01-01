import RoomsFragment from "@/components/rooms/rooms-fragment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function RoomsPage() {
  return <RoomsFragment />;
}
