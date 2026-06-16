import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import instance from "../../../shared/api/axios.instance"
import useCartStore from "../../cart/store/cart.store"
import type { FormaPagoCodigo, Order } from "../../../shared/types/order"

type CreateOrderBody = {
  forma_pago_codigo: FormaPagoCodigo
  direccion_id?: number | null
  notas?: string
  items: { producto_id: number; cantidad: number; personalizacion: number[] }[]
}

export function useCreateOrder() {

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()

  return useMutation({
    // crea el pedido y, si la forma de pago es MercadoPago, genera la preferencia de Checkout PRO
    mutationFn: async (forma_pago_codigo: FormaPagoCodigo) => {
      const body: CreateOrderBody = {
        forma_pago_codigo,
        items: items.map((item) => ({
          producto_id: item.id,
          cantidad: item.quantity,
          // ingredientes que el cliente pidió remover
          personalizacion: item.personalizacion,
        })),
      }
      const { data: pedido } = await instance.post<Order>("/pedidos", body)

      // MercadoPago: pedimos al backend la preferencia y devolvemos el init_point para redirigir.
      if (forma_pago_codigo === "MERCADOPAGO") {
        const { data } = await instance.post<{ init_point: string }>("/pagos/preferencia", {
          pedido_id: pedido.id,
        })
        return { initPoint: data.init_point as string | null }
      }
      return { initPoint: null as string | null }
    },
    // vacía carrito, invalida cache y redirige (a MercadoPago si hay init_point, si no a /orders)
    onSuccess: ({ initPoint }) => {
      clearCart()
      queryClient.invalidateQueries({ queryKey: ["pedidos"] })
      queryClient.invalidateQueries({ queryKey: ["productos"] })
      if (initPoint) {
        window.location.href = initPoint
      } else {
        navigate("/orders")
      }
    },
  })
}
