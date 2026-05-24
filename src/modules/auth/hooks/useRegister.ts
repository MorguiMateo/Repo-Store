import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import instance from "../../../shared/api/axios.instance"
import useAuthStore from "../store/auth.store"

interface RegisterBody {
  nombre: string
  apellido: string
  email: string
  password: string
}

interface RegisterResponse {
  id: number
  email: string
  nombre: string
  apellido: string
  celular: string | null
  roles: string[]
  created_at: string
}

export function useRegister() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    // el back asigna automáticamente el rol CLIENT al registrar.
    // luego del registro hay que loguearse para obtener la cookie.
    mutationFn: async (body: RegisterBody) => {
      const { data: user } = await instance.post<RegisterResponse>("/auth/register", body)
      await instance.post("/auth/login", { email: body.email, password: body.password })
      return user
    },
    onSuccess: (user) => {
      setUser(user)
      navigate("/")
    },
  })
}
