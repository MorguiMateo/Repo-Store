import type { AxiosInstance } from "axios"

export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  )

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API error:", error.response?.status, error.response?.data)
      return Promise.reject(error)
    }
  )
}