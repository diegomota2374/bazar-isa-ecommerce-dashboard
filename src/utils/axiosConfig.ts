import axios from "axios";

const urlApi = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// Cria uma instância do Axios com a URL base da API
const api = axios.create({
  baseURL: urlApi, // Pega a URL base do .env
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
