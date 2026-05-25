import { Link } from "react-router-dom"
import type { Order, OrderStatus } from "../../../shared/types/order"

//en lugar de llenar de if y condiciones el codigo lo defino arriba para luego
//  simplemente hacer statusLabel[order.estado_codigo] por ejemplo.

const statusLabel: Record<OrderStatus, string> = {
  PENDIENTE:  "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_PREP:    "En preparación",
  EN_CAMINO:  "En camino",
  ENTREGADO:  "Entregado",
  CANCELADO:  "Cancelado",
}

const statusColor: Record<OrderStatus, string> = {
  PENDIENTE:  "bg-yellow-100 text-yellow-700",
  CONFIRMADO: "bg-blue-100 text-blue-700",
  EN_PREP:    "bg-orange-100 text-orange-700",
  EN_CAMINO:  "bg-purple-100 text-purple-700",
  ENTREGADO:  "bg-green-100 text-green-700",
  CANCELADO:  "bg-red-100 text-red-700",
}

export default function OrderCard({ order }: { order: Order }) {
  const fecha = new Date(order.created_at).toLocaleDateString()

  return (
    <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <p className="text-text-muted text-sm">Pedido #{order.id}</p>
        {/* color segun estado */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.estado_codigo]}`}>
            {/* texto segun estado */}
          {statusLabel[order.estado_codigo]}
        </span>
      </div>

        {/*Order extrae los detalles de OrderDetail */}
      <div className="flex flex-col gap-1">
        {order.detalles.map((detail) => (
          <div key={detail.producto_id} className="flex justify-between text-text-secondary text-sm">
            <span>{detail.nombre_snapshot} x {detail.cantidad}</span>
            <span>${detail.subtotal_snap}</span>
          </div>
        ))}
        <div className="flex justify-between text-text-muted text-sm">
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
      </div>

      <div className="flex justify-between items-center border-t border-border pt-4">
        <span className="text-text-muted text-xs">{fecha}</span>
        <div className="flex items-center gap-4">
          <span className="font-bold text-text-primary">${order.total}</span>
          <Link to={`/orders/${order.id}`} className="text-orange text-sm font-semibold hover:underline">
            Ver detalle →
          </Link>
        </div>
      </div>

    </div>
  )
}
