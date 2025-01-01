// "use client";

import { IUser } from "@/app/interfaces/user/user";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Constants from "./constants";

export function useUser() {
  const [user, setUser] = useState<IUser | null>();

  // const cookiesStore=await cookies()
  //  cookiesStore.g(Constants.userKey,)
  // localStorage.setItem(Constants.userKey, JSON.stringify(data));

  useEffect(() => {
    const user = getCookie(Constants.userKey);
    if (user) {
      try {
        setUser(JSON.parse(user.toString())); // Parse the cookie and set the user
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
      }
    }
  }, []);

  return user;
}
