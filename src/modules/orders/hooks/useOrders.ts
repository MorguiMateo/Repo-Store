import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import instance from "../../../shared/api/axios.instance"
import type { Order } from "../../../shared/types/order"

export function useOrders() {
  return useQuery({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const response = await instance.get<Order[]>("/pedidos")
      return response.data
    },
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["pedidos", id],
    queryFn: async () => {
      const response = await instance.get<Order>(`/pedidos/${id}`)
      return response.data
    },
  })
}

export function useCancelOrder(id: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    // el back valida que el estado sea PENDIENTE o CONFIRMADO antes de cancelar.
    // motivo es obligatorio en el body.
    mutationFn: (motivo: string) =>
      instance.post(`/pedidos/${id}/cancelar`, { motivo }),
    onSuccess: () => {
      // fuerza un refetch para que la lista de pedidos refleje el nuevo estado
      queryClient.invalidateQueries({ queryKey: ["pedidos"] })
      navigate("/orders")
    },
  })
}
