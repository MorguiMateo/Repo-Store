import { useMutation } from "@tanstack/react-query"
import instance from "../../../shared/api/axios.instance"
import useAuthStore from "../store/auth.store"

interface UpdateProfileBody {
  nombre: string
  apellido: string
  celular: string | null
}

interface UpdateProfileResponse {
  id: number
  email: string
  nombre: string
  apellido: string
  celular: string | null
  roles: string[]
  created_at: string
}

//hook para que el usuario edite sus propios datos (nombre, apellido, celular)
//pega a PATCH /auth/me, que actualiza al usuario logueado segun la cookie
export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (body: UpdateProfileBody) =>
      instance.patch<UpdateProfileResponse>("/auth/me", body).then((r) => r.data),
    //refrescamos el store con los datos que ya guardo el back
    onSuccess: (user) => {
      setUser(user)
    },
  })
}
