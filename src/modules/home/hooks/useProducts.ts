import { useQuery } from "@tanstack/react-query"
import instance from "../../../shared/api/axios.instance"
import type { Product } from "../../../shared/types/product"

export const useProducts = (q?: string) => {
  return useQuery({
    queryKey: ['productos', { q }],
    queryFn: async () => {
      const response = await instance.get<Product[]>('/productos', {
        // si q es undefined Axios no lo manda y el back devuelve todos los productos
        // esto para que la home muestre el catálogo completo cuando no hay búsqueda activa
        params: { q },
      })
      return response.data
    },
  })
}