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
    //el back valida que el estado sea PENDIENTE o CONFIRMADO antes de cancelar. el motivo es obligatorio
    mutationFn: (motivo: string) =>
      instance.post(`/pedidos/${id}/cancelar`, { motivo }),
    onSuccess: () => {
      //forzamos un refetch para que la lista de pedidos muestre el nuevo estado
      queryClient.invalidateQueries({ queryKey: ["pedidos"] })
      navigate("/orders")
    },
  })
}
