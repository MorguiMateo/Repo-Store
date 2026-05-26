import type { AxiosInstance } from "axios"

export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const url: string = error.config?.url ?? ''

      if (error.response?.status !== 401) return Promise.reject(error)

      // login y refresh: el caller maneja el error directamente
      if (url.includes('/auth/login') || url.includes('/auth/refresh')) return Promise.reject(error)

      // ya se reintentó una vez — evita loop infinito si el retry también da 401
      if (error.config._retry) return Promise.reject(error)
        //
      error.config._retry = true
        //
      try {
        await instance.post('/auth/refresh')
        return instance(error.config)
      } catch {
        // /auth/me lo maneja App.tsx → clearUser() → ProtectedRoute redirige a /login
        if (!url.includes('/auth/me')) window.location.href = '/login'
        return Promise.reject(error)
      }
    }
  )
}
