import AuthFragment from "@/components/auth/auth-fragment";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication - Login/Signup",
};

export default function AuthPage() {
  return (
    //suspense should wrap 'useSearchParams()'
    <Suspense>
      <AuthFragment />
    </Suspense>
  );
}
