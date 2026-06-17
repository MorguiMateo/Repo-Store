import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { API_BASE_URL } from "../../../shared/api/axios.instance"

//armamos la url del websocket a partir de la misma base del axios, cambiando http por ws
const WS_URL = API_BASE_URL.replace(/^http/, "ws") + "/pedidos/ws"


const TRACKED_EVENTS = ["ORDER_CREATED", "ORDER_STATE_CHANGED"]

interface OrderEvent {
  event?: string
  pedido_id?: number
}

//abre un websocket y refresca el pedido cuando el back manda un evento de ese pedido
//la cookie de sesion viaja sola en el handshake, asi que no manejamos tokens aca
//el back ya filtra para que el cliente reciba solo eventos de sus propios pedidos
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
