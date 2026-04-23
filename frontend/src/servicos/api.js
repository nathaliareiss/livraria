import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8001",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user?.email) {
        config.headers["X-User-Email"] = user.email;
      }
    } catch {
      // Ignore malformed cached user data.
    }
  }

  return config;
});

export default api;
