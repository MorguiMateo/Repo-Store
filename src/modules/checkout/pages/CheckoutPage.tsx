import { useState } from "react"
import { Navigate } from "react-router-dom"
import useCartStore from "../../cart/store/cart.store"
import { useCreateOrder } from "../hooks/useCreateOrder"
import type { FormaPagoCodigo } from "../../../shared/types/order"
import { COSTO_ENVIO } from "../../../shared/constants"

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

  const { mutate: createOrder, isPending, isError } = useCreateOrder()

  if (items.length === 0) return <Navigate to="/" />

  // solo los items que tienen al menos un ingrediente removible
  const customizableItems = items.filter((item) =>
    item.ingredientes.some((pi) => pi.es_removible)
  )

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
                      // tildado si el id ya está en el array
                      checked={item.personalizacion.includes(i.ingrediente.id)}
                      // al hacer click agrega o saca el id del array
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
          Hubo un error al crear el pedido. Intentá de nuevo.
        </p>
      )}

      <button
        onClick={() => createOrder(formaPago)}
        disabled={isPending}
        className="w-full bg-obsidian text-text-on-dark font-semibold py-3 rounded-xl hover:bg-obsidian-soft transition-colors disabled:opacity-50"
      >
        {isPending
          ? (formaPago === "MERCADOPAGO" ? "Redirigiendo a MercadoPago..." : "Procesando...")
          : (formaPago === "MERCADOPAGO" ? "Pagar con MercadoPago" : "Confirmar pedido")}
      </button>
    </div>
  )
}
