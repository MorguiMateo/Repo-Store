import { useQuery } from "@tanstack/react-query"
import instance from "../../../shared/api/axios.instance"
import type { Product } from "../../../shared/types/product"

export const useProducts = () => {
  return useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const response = await instance.get<Product[]>('/productos', {
        params: { skip: 0, limit: 100 },
      })
      return response.data
    },
  })
}
