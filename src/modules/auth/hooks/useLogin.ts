import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import instance from "../../../shared/api/axios.instance"
import useAuthStore from "../store/auth.store"

interface LoginBody {
  email: string
  password: string
}

interface LoginResponse {
  id: number
  email: string
  nombre: string
  apellido: string
  roles: string[]
}
//custom hook del llogin
export function useLogin() {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    //body recibe mail y contra
    mutationFn: (body: LoginBody) =>
      instance.post<LoginResponse>("/auth/login", body).then((r) => r.data),
    //user = valor ddevuelto por mutationFn
    onSuccess: (user) => {
      setUser(user)
      navigate("/")
    },
  })
}
