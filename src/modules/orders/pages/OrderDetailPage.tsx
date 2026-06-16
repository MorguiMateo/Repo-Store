import { useParams, useSearchParams, Link } from "react-router-dom"
import { useOrder, useCancelOrder } from "../hooks/useOrders"
import { useOrderSocket } from "../hooks/useOrderSocket"
import type { OrderStatus } from "../../../shared/types/order"

// estados desde los cuales el cliente puede cancelar su pedido
const CANCELLABLE: OrderStatus[] = ["PENDIENTE", "CONFIRMADO"]

// banner según el ?pago= con el que MercadoPago redirige de vuelta (back_urls)
const PAGO_BANNER: Record<string, { text: string; className: string }> = {
  success: { text: "¡Pago aprobado! Estamos confirmando tu pedido.", className: "bg-success/10 text-success border-success/30" },
  pending: { text: "Tu pago quedó pendiente de acreditación.", className: "bg-warning/10 text-warning border-warning/30" },
  failure: { text: "El pago no se pudo completar. Podés reintentar desde el carrito.", className: "bg-danger/10 text-danger border-danger/30" },
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const pagoBanner = PAGO_BANNER[searchParams.get("pago") ?? ""]
  const { data: order, isLoading, isError } = useOrder(id!)
  // suscripción WebSocket: refresca el pedido en vivo cuando cambia de estado
  const { connected } = useOrderSocket(id!)
  // renombramos para que isPending e isError no se repitan
  const { mutate: cancelOrder, isPending: isCancelling, isError: cancelError } = useCancelOrder(id!)

  if (isLoading) return <p className="py-10 text-center text-text-muted">Cargando pedido...</p>

  if (isError || !order) return (
    <div className="py-10 text-center">
      <p className="text-danger mb-4">No se pudo cargar el pedido.</p>
      <Link to="/orders" className="text-orange font-semibold hover:underline">Volver a mis pedidos</Link>
    </div>
  )

  // true solo si el estado actual permite cancelar, de lo contrario el botón no renderiza
  const cancellable = CANCELLABLE.includes(order.estado_codigo)

  return (
    <div className="py-10 max-w-2xl mx-auto">

      <div className="flex items-center gap-4 mb-8">
        <Link to="/orders" className="text-text-muted hover:text-orange transition-colors text-sm">
          ← Mis pedidos
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Pedido #{order.id}</h1>
      </div>

      {pagoBanner && (
        <div className={`border rounded-2xl px-5 py-4 mb-6 text-sm font-medium ${pagoBanner.className}`}>
          {pagoBanner.text}
        </div>
      )}

      <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 mb-6">
        <div className="flex justify-between text-sm text-text-muted">
          <span className="flex items-center gap-2">
            Estado
            {connected && (
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> En vivo
              </span>
            )}
          </span>
          <span className="font-semibold text-text-primary">{order.estado_codigo}</span>
        </div>
        <div className="flex justify-between text-sm text-text-muted">
          <span>Forma de pago</span>
          <span className="font-semibold text-text-primary">{order.forma_pago_codigo}</span>
        </div>
        <div className="flex justify-between text-sm text-text-muted">
          <span>Fecha</span>
          <span className="font-semibold text-text-primary">{new Date(order.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col gap-3 mb-6">
        <p className="font-semibold text-text-primary mb-2">Detalle</p>
        {order.detalles.map((detail) => (
          <div key={detail.producto_id} className="flex justify-between text-text-secondary text-sm">
            <span>{detail.nombre_snapshot} x {detail.cantidad}</span>
            <span className="text-text-primary font-semibold">${detail.subtotal_snap}</span>
          </div>
        ))}
        <div className="flex justify-between text-text-muted text-sm border-t border-border pt-4">
          <span>Subtotal</span>
          <span>${order.subtotal}</span>
        </div>
        {order.descuento > 0 && (
          <div className="flex justify-between text-text-muted text-sm">
            <span>Descuento</span>
            <span>-${order.descuento}</span>
          </div>
        )}
        <div className="flex justify-between text-text-muted text-sm">
          <span>Envío</span>
          <span>${order.costo_envio}</span>
        </div>
        <div className="flex justify-between font-bold text-text-primary text-lg border-t border-border pt-4">
          <span>Total</span>
          <span className="text-orange">${order.total}</span>
        </div>
      </div>

      {cancellable && (
        <div className="flex flex-col gap-2">
          {cancelError && (
            <p className="text-danger text-sm">No se pudo cancelar el pedido. Intentá de nuevo.</p>
          )}
          <button
            onClick={() => {
              const motivo = window.prompt("Contanos el motivo de la cancelación:")?.trim()
              if (motivo) cancelOrder(motivo)
            }}
            disabled={isCancelling}
            className="text-sm text-danger hover:underline disabled:opacity-50"
          >
            {isCancelling ? "Cancelando..." : "Cancelar pedido"}
          </button>
        </div>
      )}

    </div>
  )
}
