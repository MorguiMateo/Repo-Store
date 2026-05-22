import { useSearchParams } from "react-router-dom"
import { useProducts } from "../hooks/useProducts"
import ProductGrid from "../components/ProductGrid"

export default function HomePage() {
  // useSearchParams lee los query params de la URL, q = "pizza"
  const [searchParams] = useSearchParams()
  // || undefined convierte string vacío a undefined para que useProducts no mande ?q= al back
  const q = searchParams.get("q") || undefined

  const { data, isLoading, error } = useProducts(q)

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Nuestros Productos</h1>

      {q ? (
        <p className="text-text-secondary mb-8">
          Resultados para: <span className="font-semibold text-text-primary">"{q}"</span>
        </p>
      ) : (
        <p className="text-text-muted mb-8">Explorá nuestro catálogo</p>
      )}

      {isLoading && <p className="text-text-muted text-center py-10">Cargando...</p>}
      {error && <p className="text-danger text-center py-10">Error al cargar productos.</p>}
      {data && <ProductGrid products={data} />}
    </div>
  )
}
