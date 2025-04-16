"use server";
import "server-only";

import axiosStatic, { AxiosError } from "axios";
import Constants from "./constants";
import { handleTokens, handleUnauthorized } from "./server-token";

const axios = axiosStatic.create({
  baseURL: process.env.API_BASE_URL,
  withCredentials: true,
});

axios.interceptors.request.use(
  async (config) => {
    const res = await handleTokens(config);

    if (res)
      config.headers.set(
        Constants.authTokensHeaderKey,
        JSON.stringify(res.tokens)
      );

    return { ...config, ...(res && { signal: res.abortSignal }) };
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
    const statusCode = (error.response?.data as { statusCode: number })
      .statusCode;
    if (statusCode == 401) {
      handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

export default axios;
