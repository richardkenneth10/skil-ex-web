import { AuthTokens } from "@/app/interfaces/token/token";
import { InternalAxiosRequestConfig } from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import axios from "./axios";
import Constants from "./constants";
import parseJwt from "./parse-jwt";

export const noAuthPaths = [
  "/auth/register",
  "/auth/login",
  "/auth/refresh-token",
];

export const refreshToken = async (refreshToken: string) => {
  const tokens = (await axios.post("/auth/refresh-token", { refreshToken }))
    .data as AuthTokens;
  return tokens;
};

export const handleTokens = async (config: InternalAxiosRequestConfig) => {
  if (!config.url || noAuthPaths.includes(config.url)) return;

  const {
    tokens: { access, refresh },
    abortSignal,
  } = await ensureAccessTokenIsRefreshed();

  if (access) config.headers.setAuthorization(`Bearer ${access}`);
  return { tokens: { access, refresh }, abortSignal };
};

export const ensureAccessTokenIsRefreshed = async () => {
  let access = getCookie(Constants.accessTokenKey)?.toString();
  let refresh = getCookie(Constants.refreshTokenKey)?.toString();

  const abortCtl = new AbortController();
  if (!access && refresh) {
    const { access: newAccess, refresh: newRefresh } = await refreshToken(
      refresh
    );
    access = newAccess;
    refresh = newRefresh;
    await saveAuthTokens({ access, refresh });
  } else if (!refresh) {
    abortCtl.abort();
    handleUnauthorized();
  }

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
  await setCookie(Constants.accessTokenKey, access, { expires: accessExp });
  await setCookie(Constants.refreshTokenKey, refresh, { expires: refreshExp });
};

export const handleUnauthorized = () => {
  clearCookies();
  //can't use react router in axios interceptor
  window.location.href = "/auth?page=login";
};

export const clearCookies = () => {
  deleteCookie(Constants.userKey);
  deleteCookie(Constants.userAgentKey);
  deleteCookie(Constants.accessTokenKey);
  deleteCookie(Constants.refreshTokenKey);
};
