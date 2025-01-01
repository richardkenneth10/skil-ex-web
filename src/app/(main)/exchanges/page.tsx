import ExchangesFragment from "@/components/exchanges/exchanges-fragment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function ExchangesPage() {
  return <ExchangesFragment />;
}
