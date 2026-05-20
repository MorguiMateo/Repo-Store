import type { Product } from "../../../shared/types/product"
import ProductCard from "./ProductCard"


//No esta en una carpeta types porque solo se usa en este archivo
interface Props {
  products: Product[]
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
