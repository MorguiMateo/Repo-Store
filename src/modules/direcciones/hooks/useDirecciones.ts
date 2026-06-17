import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import instance from "../../../shared/api/axios.instance"
import type { Direccion, DireccionPayload } from "../../../shared/types/direccion"

//lista las direcciones del usuario logueado (el back ya filtra por el usuario actual)
export function useDirecciones() {
  return useQuery({
    queryKey: ["direcciones"],
    queryFn: async () => {
      const response = await instance.get<Direccion[]>("/direcciones")
      return response.data
    },
  })
}

export function useCreateDireccion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DireccionPayload) =>
      instance.post<Direccion>("/direcciones", data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["direcciones"] }),
  })
}

export function useUpdateDireccion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DireccionPayload }) =>
      instance.put<Direccion>(`/direcciones/${id}`, data).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["direcciones"] }),
  })
}

export function useDeleteDireccion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => instance.delete(`/direcciones/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["direcciones"] }),
  })
}

//PATCH /direcciones/{id}/principal: el back se encarga de desmarcar la que era principal antes
export function useSetPrincipal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      instance.patch<Direccion>(`/direcciones/${id}/principal`).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["direcciones"] }),
  })
}
