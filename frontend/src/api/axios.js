import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // sends the httpOnly JWT cookie
});

export default api;
