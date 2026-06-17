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

//el checkout pasa la forma de pago y la direccion de entrega elegida
type CreateOrderInput = {
  forma_pago_codigo: FormaPagoCodigo
  direccion_id: number | null
}

export function useCreateOrder() {

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { items, clearCart } = useCartStore()

  return useMutation({
    //crea el pedido y, si la forma de pago es mercado pago, genera la preferencia del checkout
    mutationFn: async ({ forma_pago_codigo, direccion_id }: CreateOrderInput) => {
      const body: CreateOrderBody = {
        forma_pago_codigo,
        direccion_id,
        items: items.map((item) => ({
          producto_id: item.id,
          cantidad: item.quantity,
          //los ingredientes que el cliente saco
          personalizacion: item.personalizacion,
        })),
      }
      const { data: pedido } = await instance.post<Order>("/pedidos", body)

      //mercado pago: le pedimos al back la preferencia y devolvemos el init_point para redirigir
      if (forma_pago_codigo === "MERCADOPAGO") {
        const { data } = await instance.post<{ init_point: string }>("/pagos/preferencia", {
          pedido_id: pedido.id,
        })
        return { initPoint: data.init_point as string | null }
      }
      return { initPoint: null as string | null }
    },
    //vacia el carrito, invalida la cache y redirige (a mercado pago si hay init_point, si no a /orders)
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
