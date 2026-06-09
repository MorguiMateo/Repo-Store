import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

// El base del axios es http://localhost:8000/api/v1 → ws://localhost:8000/api/v1/pedidos/ws
const WS_URL = "http://localhost:8000/api/v1".replace(/^http/, "ws") + "/pedidos/ws"


const TRACKED_EVENTS = ["ORDER_CREATED", "ORDER_STATE_CHANGED"]

interface OrderEvent {
  event?: string
  pedido_id?: number
}

// Abre un WebSocket y refresca el pedido `id` cuando el backend emite un evento suyo.
// La cookie httpOnly de sesión viaja sola en el handshake → no manejamos tokens acá.
// El backend ya filtra para que el cliente reciba solo eventos de sus propios pedidos.
export function useOrderSocket(id: string) {
  const queryClient = useQueryClient()
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!id) return

    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      setConnected(true)
    }

    ws.onmessage = (event) => {
      let msg: OrderEvent
      try {
        msg = JSON.parse(event.data)
      } catch {
        return
      }
      if (msg.event && TRACKED_EVENTS.includes(msg.event) && msg.pedido_id === Number(id)) {
        queryClient.invalidateQueries({ queryKey: ["pedidos", id] })
        queryClient.invalidateQueries({ queryKey: ["pedidos"] })
      }
    }

    ws.onclose = () => {
      setConnected(false)
    }

    return () => {
      ws.close()
    }
  }, [id, queryClient])

  return { connected }
}
