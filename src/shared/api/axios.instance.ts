import axios from "axios";
import { setupInterceptors } from "./interceptors";

//la base de la api. se configura con VITE_API_URL y si no, va a localhost para desarrollo
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