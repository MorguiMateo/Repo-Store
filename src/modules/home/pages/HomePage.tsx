import { useSearchParams } from "react-router-dom"
import { useProducts } from "../hooks/useProducts"
import ProductGrid from "../components/ProductGrid"

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get("q") || undefined

  const { data: allProducts, isLoading, error } = useProducts()

  // filtrado client-side sobre la lista completa
  const data = q && allProducts
    ? allProducts.filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase()))
    : allProducts

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
