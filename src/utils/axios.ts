import axiosStatic, { AxiosError } from "axios";
import { handleTokens, handleUnauthorized } from "./token";

const axios = axiosStatic.create({
  baseURL: process.env.PUBLIC_API_BASE_URL,
  withCredentials: true,
  //   timeout: 10000,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

axios.interceptors.request.use(
  async (config) => {
    console.log(config.baseURL);
    const res = await handleTokens(config);

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
    const statusCode = (
      error.response?.data as { statusCode: number } | undefined
    )?.statusCode;
    // const originalRequest = error.config as
    //   | (InternalAxiosRequestConfig<any> & { _retry?: boolean })
    //   | undefined;
    // const refresh = getCookie(Constants.refreshTokenKey)?.toString();
    // console.log(refresh);
    // if (
    //   statusCode == 401 &&
    //   refresh &&
    //   originalRequest &&
    //   !originalRequest?._retry
    // ) {
    //   originalRequest._retry = true;
    //   try {
    //     const tokens = await refreshToken(refresh);
    //    await saveAuthTokens(tokens);
    //     // axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    //     originalRequest.headers.setAuthorization(`Bearer ${tokens.access}`);
    //     return axios(originalRequest);
    //   } catch (refreshError) {
    //     //redirect
    //     await axios.post("/auth/logout");
    //     // redirect("/auth?page=login");
    //     window.location.href = "/auth/login";

    //     return Promise.reject(refreshError);
    //   }
    // }
    // return Promise.reject(error);

    if (statusCode == 401) {
      handleUnauthorized();
    }
  }
);

export default axios;
