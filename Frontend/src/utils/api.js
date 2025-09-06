import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-yox9.onrender.com/api", // your backend URL
});

export default api;
