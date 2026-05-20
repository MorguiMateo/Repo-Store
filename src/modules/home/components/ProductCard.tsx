import type { Product } from "../../../shared/types/product"

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const imagen = product.imagenes_url[0] ?? "/placeholder.jpg"
  const categoria = product.categorias.find((c) => c.es_principal)?.categoria.nombre

  return (
    <div className="bg-bg-surface border border-border rounded-2xl overflow-hidden flex flex-col">

      <img
        src={imagen}
        alt={product.nombre}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col gap-2 flex-1">

        {categoria && (
          <span className="text-xs text-text-muted uppercase">
            {categoria}
          </span>
        )}

        <h3 className="text-text-primary font-semibold text-base">
          {product.nombre}
        </h3>
        {/* line-clamp-2 es para que el texto se corte y se muestre con ... */}
        {product.descripcion && (
          <p className="text-text-secondary text-sm line-clamp-2">
            {product.descripcion}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-orange font-bold text-lg">
            ${product.precio_base}
          </span>

          {product.disponible ? (
            <button className="bg-obsidian text-text-on-dark text-sm font-semibold px-4 py-2 rounded-xl hover:bg-obsidian-soft">
              Agregar
            </button>
          ) : (
            <span className="text-xs text-danger font-semibold">Sin stock</span>
          )}
        </div>

      </div>
    </div>
  )
}
