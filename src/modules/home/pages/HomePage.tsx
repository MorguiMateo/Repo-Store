import { useProducts } from "../hooks/useProducts"
import ProductGrid from "../components/ProductGrid"

export default function HomePage() {

  const { data, isLoading, error} = useProducts()

  return <div>
    <h1>Nuestros Productos</h1>

    {isLoading && <p>Cargando...</p>}
    {error && <p>Error al cargar prodtos</p>}
    {data && <ProductGrid products={data}/>}
  </div>

}
