import { Link } from "react-router-dom"
import { useOrders } from "../hooks/useOrders"
import OrderCard from "../components/OrderCard"

export default function OrdersPage() {

  {/*renombro data como orders por legibilidad */}
  const { data: orders, isLoading, isError } = useOrders()

  if (isLoading) return <p className="py-10 text-center text-text-muted">Cargando pedidos...</p>

  if (isError) return <p className="py-10 text-center text-danger">Error al cargar los pedidos.</p>

  if (!orders || orders.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-text-secondary mb-4">Todavía no realizaste ningún pedido.</p>
        <Link to="/" className="text-orange font-semibold hover:underline">
          Ver productos
        </Link>
      </div>
    )
  }
 {/* si esta en loading o da error o no hay pediodo carga los pedidos */}
  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold text-text-primary mb-8">Mis pedidos</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
