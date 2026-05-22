import type { AxiosInstance } from "axios"

export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    // si la respuesta llega con error entra acá
    async (error) => {
      const isUnauthorized = error.response?.status === 401
      // evita loop infinito: si el refresh falla con 401 no reintentamos
      const isRefreshUrl = error.config?.url?.includes("/auth/refresh")
      // /auth/me se usa para chequear sesión — un 401 ahí es esperado, lo maneja App.tsx con clearUser()
      const isSessionCheck = error.config?.url?.includes("/auth/me")

      if (isUnauthorized && !isRefreshUrl && !isSessionCheck) {
        try {
          // pedimos un token nuevo al navegador
          await instance.post("/auth/refresh")
          // reintentamos el request original con el nuevo token
          return instance(error.config)
        } catch {
          // si el refresh también falla lo rajamos para el login
          window.location.href = "/login"
        }
      }

      // cualquier otro error (500, 404, etc.) se rechaza.
      return Promise.reject(error)
    }
  )
}
