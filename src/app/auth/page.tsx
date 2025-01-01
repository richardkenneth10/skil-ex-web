import AuthFragment from "@/components/auth/auth-fragment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication - Login/Signup",
};

export default function AuthPage() {
  return <AuthFragment />;
}
