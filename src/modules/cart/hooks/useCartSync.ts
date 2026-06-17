import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { API_BASE_URL } from "../../../shared/api/axios.instance"
import useAuthStore from "../../auth/store/auth.store"
import useCartStore from "../store/cart.store"

//el mismo websocket que usa el OrderDetailPage
const WS_URL = API_BASE_URL.replace(/^http/, "ws") + "/pedidos/ws"

interface OrderEvent {
  event?: string
  pedido_id?: number
  owner_id?: number | null
}

//sincroniza el carrito y los pedidos entre ventanas del mismo usuario en tiempo real
//ORDER_CREATED: vacia el carrito (el pedido ya se hizo) y refresca los pedidos
//ORDER_STATE_CHANGED: refresca la lista y el detalle en vivo
//el back ya filtra para que el cliente reciba solo sus eventos, igual chequeamos el owner_id por las dudas
export function useCartSync() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((s) => s.user?.id)
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    if (!userId) return

    const ws = new WebSocket(WS_URL)

    ws.onmessage = (event) => {
      let msg: OrderEvent
      try {
        msg = JSON.parse(event.data)
      } catch {
        return
      }
      if (msg.owner_id !== userId) return

      //cualquier evento de un pedido propio refresca la lista y el detalle en todas las ventanas
      if (msg.event === "ORDER_CREATED" || msg.event === "ORDER_STATE_CHANGED") {
        queryClient.invalidateQueries({ queryKey: ["pedidos"] })
      }

      //cuando se crea el pedido, el carrito ya no sirve en ninguna ventana
      if (msg.event === "ORDER_CREATED") {
        clearCart()
      }
    }

    return () => {
      ws.close()
    }
  }, [userId, clearCart, queryClient])
}
