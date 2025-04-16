import { UserRole } from "@/app/interfaces/user/user";

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    typeof window === "undefined"
      ? Buffer.from(base64, "base64").toString("utf-8")
      : window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
  );

  return JSON.parse(jsonPayload) as {
    sub: number;
    role: UserRole;
    iat: number;
    exp: number;
  };
}

export default parseJwt;
