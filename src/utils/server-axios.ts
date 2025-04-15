"use server";
import "server-only";

import axiosStatic, { AxiosError } from "axios";
import { deleteCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Constants from "./constants";

const axios = axiosStatic.create({
  baseURL: "https://skil-ex-production.up.railway.app/",
  withCredentials: true,
});

axios.interceptors.request.use(
  async (config) => {
    const cookiesStore = await cookies();
    const _userAgent = cookiesStore.get(Constants.userAgentKey)?.value;

    if (_userAgent) {
      const userAgent = JSON.parse(_userAgent);
      config.headers.setUserAgent(userAgent.ua);
    }
    config.headers.set("Cookie", cookiesStore.toString());

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    console.error("Axios Error:", error.response?.data || error.message);
    if (
      (error.response?.data as unknown as { statusCode: number })
        ?.statusCode === 401 &&
      error.config?.url != "/auth/logout"
    ) {
      try {
        await axios.post("/auth/logout");
      } catch (_) {
        //ignore
      }

      console.log(error.request.cookies, " vddd");

      // const cookiesStore = await cookies();
      // cookiesStore.delete(Constants.userKey);
      deleteCookie(Constants.userKey);

      redirect("/auth?page=login");
    }

    return Promise.reject(error);
  }
);

export default axios;
