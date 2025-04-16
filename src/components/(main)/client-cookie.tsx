"use client";

import { AuthTokens } from "@/app/interfaces/token/token";
import { saveAuthTokens } from "@/utils/token";

export default function ClientCookie({
  tokensJSONString,
}: {
  tokensJSONString?: string;
}) {
  if (tokensJSONString) {
    const tokens = JSON.parse(tokensJSONString) as AuthTokens;
    saveAuthTokens(tokens);
  }
  return <></>;
}
