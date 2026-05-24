import type { AxiosInstance } from "axios"

export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    // si la respuesta llega con error entra acá
    async (error) => {
      const isUnauthorized = error.response?.status === 401
      // /auth/me se usa para chequear sesión — un 401 ahí es esperado, lo maneja App.tsx con clearUser()
      const isSessionCheck = error.config?.url?.includes("/auth/me")
      // /auth/login con credenciales inválidas también devuelve 401: lo deja burbujear al form
      const isLoginAttempt = error.config?.url?.includes("/auth/login")

      // si la cookie expiró, no hay refresh: lo rajamos al login.
      if (isUnauthorized && !isSessionCheck && !isLoginAttempt) {
        window.location.href = "/login"
      }

      // cualquier otro error (500, 404, etc.) se rechaza.
      return Promise.reject(error)
    }
  )
}
