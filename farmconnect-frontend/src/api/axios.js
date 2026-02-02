import axios from "axios";

const api = axios.create({
  baseURL: window.location.hostname === "localhost" ? "http://localhost:5000/api" : "https://farm-connect-sand.vercel.app/api",
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;
