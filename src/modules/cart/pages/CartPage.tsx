import { Link } from "react-router-dom"
import useCartStore from "../store/cart.store"
import CartItem from "../components/CartItem"
import CartSummary from "../components/CartSummary"

export default function CartPage() {
  const items = useCartStore((s) => s.items)

  if (items.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-text-secondary mb-4">Tu carrito está vacío.</p>
        {/* Link porque es una navegacion y no una accion ademas permite hacer click derecho y abrir en otra pagina*/}
        <Link to="/" className="text-orange font-semibold hover:underline">
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold text-text-primary mb-8">Tu carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div>
          <CartSummary />
        </div>

      </div>
    </div>
  )
}
