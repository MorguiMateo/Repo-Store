import type { AxiosInstance } from "axios"

export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const url: string = error.config?.url ?? ''

      if (error.response?.status !== 401) return Promise.reject(error)

      //login y refresh: el error lo maneja quien llama
      if (url.includes('/auth/login') || url.includes('/auth/refresh')) return Promise.reject(error)

      //si ya se reintento una vez, lo dejamos pasar asi no se hace un loop infinito
      if (error.config._retry) return Promise.reject(error)
      error.config._retry = true

      try {
        await instance.post('/auth/refresh')
        return instance(error.config)
      } catch {
        //el /auth/me lo maneja App.tsx (limpia el usuario y ProtectedRoute manda al login)
        if (!url.includes('/auth/me')) window.location.href = '/login'
        return Promise.reject(error)
      }
    }
  )
}
