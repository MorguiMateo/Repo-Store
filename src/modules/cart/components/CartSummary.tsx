import { useNavigate } from "react-router-dom"
import useCartStore from "../store/cart.store"
import { COSTO_ENVIO } from "../../../shared/constants"

export default function CartSummary() {
  const items = useCartStore((s) => s.items)
  const navigate = useNavigate()

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const totalPrice = items.reduce((acc, item) => acc + item.precio_base * item.quantity, 0)

  return (
    <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
      <h2 className="text-lg font-bold text-text-primary">Resumen</h2>

      <div className="flex justify-between text-text-secondary">
        <span>Productos</span>
        <span>{totalItems}</span>
      </div>

      <div className="flex justify-between text-text-secondary">
        <span>Subtotal</span>
        <span>${totalPrice}</span>
      </div>

      <div className="flex justify-between text-text-secondary">
        <span>Envío</span>
        <span>${COSTO_ENVIO}</span>
      </div>

      <div className="flex justify-between font-bold text-text-primary text-lg border-t border-border pt-4">
        <span>Total</span>
        <span className="text-orange">${totalPrice + COSTO_ENVIO}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full bg-obsidian text-text-on-dark font-semibold py-3 rounded-xl hover:bg-obsidian-soft transition-colors"
      >
        Realizar pedido
      </button>
    </div>
  )
}
