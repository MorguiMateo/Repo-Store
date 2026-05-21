import { useQuery } from "@tanstack/react-query"
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
