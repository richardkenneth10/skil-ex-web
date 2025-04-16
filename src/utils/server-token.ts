import { AuthTokens } from "@/app/interfaces/token/token";
import { InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Constants from "./constants";
import parseJwt from "./parse-jwt";
import axios from "./server-axios";
import { noAuthPaths } from "./token";

export const refreshToken = async (refreshToken: string) => {
  const tokens = (await axios.post("/auth/refresh-token", { refreshToken }))
    .data as AuthTokens;
  return tokens;
};

export const handleTokens = async (config: InternalAxiosRequestConfig) => {
  const cookiesStore = await cookies();

  //set user agent for all routes including auth
  const _userAgent = cookiesStore.get(Constants.userAgentKey)?.value;

  if (_userAgent) {
    const userAgent = JSON.parse(_userAgent);
    config.headers.setUserAgent(userAgent.ua);
  }

  if (!config.url || noAuthPaths.includes(config.url)) return;

  let access = cookiesStore.get(Constants.accessTokenKey)?.value;
  let refresh = cookiesStore.get(Constants.refreshTokenKey)?.value;

  const abortCtl = new AbortController();
  if (!access && refresh) {
    const { access: newAccess, refresh: newRefresh } = await refreshToken(
      refresh
    );
    access = newAccess;
    refresh = newRefresh;

    // await saveAuthTokens({ access, refresh });
  } else if (!refresh) {
    abortCtl.abort();
    handleUnauthorized();
  }

  // config.headers.set("Cookie", cookiesStore.toString());

  if (access) config.headers.setAuthorization(`Bearer ${access}`);
  return { tokens: { access, refresh }, abortSignal: abortCtl.signal };
};

export const saveAuthTokens = async ({ access, refresh }: AuthTokens) => {
  const oneSecond = 1000;
  //exp is in seconds
  const thirtySeconds = oneSecond * 30;
  //give gap of thirty seconds
  const accessExp = new Date(parseJwt(access).exp * oneSecond - thirtySeconds);
  const refreshExp = new Date(
    parseJwt(refresh).exp * oneSecond - thirtySeconds
  );
  const cookiesStore = await cookies();
  await cookiesStore.set(Constants.accessTokenKey, access, {
    expires: accessExp,
  });
  await cookiesStore.set(Constants.refreshTokenKey, refresh, {
    expires: refreshExp,
  });
};

export const handleUnauthorized = () => {
  clearCookies();
  redirect("/auth?page=login");
};

export const clearCookies = () => {
  cookies().then((cookiesStore) => {
    cookiesStore.delete(Constants.userKey);
    cookiesStore.delete(Constants.userAgentKey);
    cookiesStore.delete(Constants.accessTokenKey);
    cookiesStore.delete(Constants.refreshTokenKey);
  });
};
