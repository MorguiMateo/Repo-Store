import axios from "axios";
import { setupInterceptors } from "./interceptors";

// Única fuente de verdad para la base de la API. Configurable por entorno
// (VITE_API_URL) con fallback a localhost para desarrollo.
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000/api/v1'

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

setupInterceptors(instance)

export default instance