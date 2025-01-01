import HomeFragment from "@/components/home/home-fragment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function HomePage() {
  return <HomeFragment />;
}
