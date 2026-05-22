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
  roles: string[]
}

export function useRegister() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    // el back asigna automáticamente el rol al registrar
    mutationFn: (body: RegisterBody) =>
      instance.post<RegisterResponse>("/auth/registro", body).then((r) => r.data),
    onSuccess: (user) => {
      setUser(user)
      navigate("/")
    },
  })
}
