import type { CartItem } from "../../../shared/types/cart"
import useCartStore from "../store/cart.store"

interface Props {
  item: CartItem
}

export default function CartItem({ item }: Props) {
    //s = state
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)

  // si la cantidad es 1 lo borra sino le resta.
  const handleDecrease = () => {
    if (item.quantity === 1) {
      removeItem(item.id)
    } else {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  return (
    //py = pading vertical pa no poner b-t
    <div className="flex items-center gap-4 py-4 border-b border-border">
      <img src={item.imagenes_url[0] ?? "/placeholder.jpg"} alt={item.nombre} className="w-20 h-20 object-cover rounded-xl" />

        {/* Truncate + min-w-0 hace que si un nombre es muy largo quede con .... */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{item.nombre}</p>
        <p className="text-orange font-bold">${item.precio_base}</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={handleDecrease} className="w-8 h-8 border border-border rounded-lg">-</button>
        <span className="w-6 text-center">{item.quantity}</span>
        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 border border-border rounded-lg">+</button>
      </div>

      <button onClick={() => removeItem(item.id)} className="text-danger">✕</button>
    </div>
  )
}
