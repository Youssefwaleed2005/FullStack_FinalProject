import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7171/api",
});

export default api;
