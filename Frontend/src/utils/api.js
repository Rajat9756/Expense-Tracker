import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-xiqe.onrender.com/api", // your backend URL
});

export default api;
