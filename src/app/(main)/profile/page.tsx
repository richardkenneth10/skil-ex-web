import ProfileFragment from "@/components/profile/profile-fragment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function ProfilePage() {
  return <ProfileFragment />;
}
