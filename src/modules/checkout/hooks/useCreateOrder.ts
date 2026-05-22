import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import instance from "../../../shared/api/axios.instance"
import useCartStore from "../../cart/store/cart.store"
import type { FormaPagoCodigo } from "../../../shared/types/order"

type CreateOrderBody = {
  forma_pago_codigo: FormaPagoCodigo
  direccion_id?: number | null
  notas?: string
  detalles: { producto_id: number; cantidad: number; personalizacion: number[] }[]
}

export function useCreateOrder() {

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()

  return useMutation({
    //crea pedido
    mutationFn: (forma_pago_codigo: FormaPagoCodigo) => {
      const body: CreateOrderBody = {
        forma_pago_codigo,
        detalles: items.map((item) => ({
          producto_id: item.id,
          cantidad: item.quantity,
          // ingredientes que el cliente pidió remover
          personalizacion: item.personalizacion,
        })),
      }
      return instance.post("/pedidos", body)
    },
    //vacía carrito, invalida cache de pedidos y redirige.
    onSuccess: () => {
      clearCart()
      queryClient.invalidateQueries({ queryKey: ["pedidos"] })
      navigate("/orders")
    },
  })
}
