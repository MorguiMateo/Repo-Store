export type OrderStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "EN_PREP"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO"

export type FormaPagoCodigo = "MERCADOPAGO" | "EFECTIVO" | "TRANSFERENCIA"

export interface OrderDetail {
  producto_id: number
  nombre_snapshot: string
  precio_snapshot: number
  cantidad: number
  subtotal_snap: number
  personalizacion: number[]
  created_at: string
}

export interface Order {
  id: number
  usuario_id: number
  direccion_id: number | null
  estado_codigo: OrderStatus
  forma_pago_codigo: FormaPagoCodigo
  subtotal: number
  descuento: number
  costo_envio: number
  total: number
  notas: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  detalles: OrderDetail[]
}
