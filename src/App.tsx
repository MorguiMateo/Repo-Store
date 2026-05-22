import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import router from "./router"
import instance from "./shared/api/axios.instance"
import useAuthStore from "./modules/auth/store/auth.store"

function App() {
  const setUser = useAuthStore((s) => s.setUser)
  const clearUser = useAuthStore((s) => s.clearUser)

  useEffect(() => {
    // validamos si la sesión sigue activa
    instance.get("/auth/me")
      .then((res) => setUser(res.data))
      // si la cookie expiró limpiamos el store para no quedar logueado en falso
      .catch(() => clearUser())
  }, [])

  return <RouterProvider router={router} />
}

export default App
