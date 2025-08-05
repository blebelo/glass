import axios from "axios";

export const axiosInstance = () => {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  const BASE_URL = process.env.NEXT_PUBLIC_API_LINK;
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `${token}` } : {}),
    },
  });
};