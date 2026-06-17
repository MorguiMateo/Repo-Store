import { useState } from "react"
import { Navigate } from "react-router-dom"
import useCartStore from "../../cart/store/cart.store"
import { useCreateOrder } from "../hooks/useCreateOrder"
import { useDirecciones } from "../../direcciones/hooks/useDirecciones"
import DireccionFormModal from "../../direcciones/components/DireccionFormModal"
import type { FormaPagoCodigo } from "../../../shared/types/order"
import { COSTO_ENVIO } from "../../../shared/constants"
import axios from "axios"

//muestra el mensaje de error que manda el back (viene en { detail })
//los errores de stock los mostramos genericos para no exponerle el inventario al cliente
function mensajeErrorPedido(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === "string") {
      if (detail.startsWith("Stock insuficiente")) return "Stock insuficiente"
      return detail
    }
  }
  return "Hubo un error al crear el pedido. Intentá de nuevo."
}

const FORMAS_PAGO: { codigo: FormaPagoCodigo; label: string }[] = [
  { codigo: "EFECTIVO",      label: "Efectivo" },
  { codigo: "TRANSFERENCIA", label: "Transferencia bancaria" },
  { codigo: "MERCADOPAGO",   label: "MercadoPago" },
]

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const togglePersonalizacion = useCartStore((s) => s.togglePersonalizacion)
  const totalPrice = items.reduce((acc, item) => acc + item.precio_base * item.quantity, 0)
  const [formaPago, setFormaPago] = useState<FormaPagoCodigo>("EFECTIVO")

  const { data: direcciones } = useDirecciones()
  //lo que elige el usuario. si queda null usamos la direccion principal
  const [direccionElegida, setDireccionElegida] = useState<number | null>(null)
  const [addDireccionOpen, setAddDireccionOpen] = useState(false)

  const { mutate: createOrder, isPending, isError, error } = useCreateOrder()

  if (items.length === 0) return <Navigate to="/" />

  //la direccion que se usa: la que eligio el usuario, o si no la principal (o la primera que haya)
  const direccionId =
    direccionElegida ??
    (direcciones && direcciones.length > 0
      ? direcciones.find((d) => d.es_principal)?.id ?? direcciones[0].id
      : null)

  //solo los items que tienen al menos un ingrediente que se puede sacar
  const customizableItems = items.filter((item) =>
    item.ingredientes.some((pi) => pi.es_removible)
  )

  const sinDirecciones = direcciones && direcciones.length === 0
  //no se puede confirmar sin una direccion de entrega
  const puedeConfirmar = direccionId !== null

  return (
    <div className="py-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-8">Confirmar pedido</h1>

      {/* resumen de productos */}
      <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-text-secondary">
            <span>{item.nombre} x {item.quantity}</span>
            <span className="text-text-primary font-semibold">${item.precio_base * item.quantity}</span>
          </div>
        ))}

        <div className="flex justify-between text-text-muted text-sm border-t border-border pt-4">
          <span>Subtotal</span>
          <span>${totalPrice}</span>
        </div>
        <div className="flex justify-between text-text-muted text-sm">
          <span>Envío</span>
          <span>${COSTO_ENVIO}</span>
        </div>
        <div className="flex justify-between font-bold text-text-primary text-lg border-t border-border pt-4">
          <span>Total</span>
          <span className="text-orange">${totalPrice + COSTO_ENVIO}</span>
        </div>
      </div>

      {/* dirección de entrega */}
      <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text-primary">Dirección de entrega</p>
          {!sinDirecciones && (
            <button
              type="button"
              onClick={() => setAddDireccionOpen(true)}
              className="text-sm text-orange font-semibold hover:underline"
            >
              + Agregar otra
            </button>
          )}
        </div>

        {sinDirecciones ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-text-secondary">Necesitás cargar una dirección para recibir el pedido.</p>
            <button
              type="button"
              onClick={() => setAddDireccionOpen(true)}
              className="text-sm text-orange font-semibold hover:underline"
            >
              Agregar dirección
            </button>
          </div>
        ) : (
          direcciones?.map((dir) => (
            <label key={dir.id} className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="direccion"
                checked={direccionId === dir.id}
                onChange={() => setDireccionElegida(dir.id)}
                className="accent-orange mt-1"
              />
              <span className="text-sm text-text-secondary">
                <span className="text-text-primary font-medium">{dir.alias || dir.linea1}</span>
                {dir.es_principal && <span className="text-orange"> · Principal</span>}
                <br />
                {dir.linea1}
                {dir.linea2 ? `, ${dir.linea2}` : ""} — {dir.ciudad}
              </span>
            </label>
          ))
        )}
      </div>

      {/* sección x si ningún item tiene ingredientes removibles */}
      {customizableItems.length > 0 && (
        <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4 mb-6">
          <p className="text-sm font-semibold text-text-primary">Personalizar ingredientes</p>

          {customizableItems.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <p className="text-text-secondary text-sm">{item.nombre}</p>

              {/* se filtra solo los removibles y dibujamos un checkbox por cada uno */}
              {item.ingredientes
                .filter((i) => i.es_removible)
                .map((i) => (
                  <label key={i.ingrediente.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      //queda tildado si el id ya esta en el array
                      checked={item.personalizacion.includes(i.ingrediente.id)}
                      //al hacer click agrega o saca el id del array
                      onChange={() => togglePersonalizacion(item.id, i.ingrediente.id)}
                      className="accent-orange"
                    />
                    <span className="text-text-secondary text-sm">
                      Sin {i.ingrediente.nombre}
                    </span>
                  </label>
                ))}
            </div>
          ))}
        </div>
      )}

      {/* forma de pago */}
      <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col gap-3 mb-6">
        <p className="text-sm font-semibold text-text-primary">Forma de pago</p>
        {FORMAS_PAGO.map((fp) => (
          <label key={fp.codigo} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="forma_pago"
              value={fp.codigo}
              checked={formaPago === fp.codigo}
              onChange={() => setFormaPago(fp.codigo)}
              className="accent-orange"
            />
            <span className="text-text-secondary text-sm">{fp.label}</span>
          </label>
        ))}
      </div>

      {isError && (
        <p className="text-danger text-sm mb-4">
          {mensajeErrorPedido(error)}
        </p>
      )}

      <button
        onClick={() => createOrder({ forma_pago_codigo: formaPago, direccion_id: direccionId })}
        disabled={isPending || !puedeConfirmar}
        className="w-full bg-obsidian text-text-on-dark font-semibold py-3 rounded-xl hover:bg-obsidian-soft transition-colors disabled:opacity-50"
      >
        {isPending
          ? (formaPago === "MERCADOPAGO" ? "Redirigiendo a MercadoPago..." : "Procesando...")
          : (formaPago === "MERCADOPAGO" ? "Pagar con MercadoPago" : "Confirmar pedido")}
      </button>

      {addDireccionOpen && (
        <DireccionFormModal
          onClose={() => setAddDireccionOpen(false)}
          //selecciona sola la direccion que se acaba de crear
          onSaved={(saved) => setDireccionElegida(saved.id)}
        />
      )}
    </div>
  )
}
