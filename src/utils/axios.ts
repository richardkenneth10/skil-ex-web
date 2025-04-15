import axiosStatic from "axios";

const axios = axiosStatic.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  //   timeout: 10000,
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
});

axios.interceptors.request.use(
  (config) => {
    console.log(config.baseURL);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axios;
