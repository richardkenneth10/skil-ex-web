"use client";

import { setCookie } from "cookies-next";

export default function ClientCookie({ cookie }: { cookie?: string[] }) {
  console.log(cookie);
  console.log(typeof cookie);

  // const all = await getCookies();
  // console.log(all);
  // console.debug(all);

  if (cookie) {
    cookie.forEach(async (cookieString) => {
      const [keyValue, ...attributes] = cookieString.split("; "); // Split the cookie string into key-value and attributes
      const [key, value] = keyValue.split("="); // Extract the key and value

      const options: Record<string, unknown> = {};
      attributes.forEach((attr: string) => {
        const [attrKey, attrValue] = attr.split("=");
        if (attrKey.toLowerCase() === "expires") {
          options.expires = new Date(attrValue); // Convert Expires to a Date object
          // } else if (attrKey.toLowerCase() === 'httponly') {
          //   options.httpOnly = true;
        } else if (attrKey.toLowerCase() === "secure") {
          options.secure = true;
        } else if (attrKey.toLowerCase() === "samesite") {
          options.sameSite = attrValue; // SameSite can be 'Strict', 'Lax', or 'None'
        }
      });

      await setCookie(key, value, { ...options });
    });
  }
  return <></>;
}
