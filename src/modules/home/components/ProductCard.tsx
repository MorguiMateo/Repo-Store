import type { Product } from "../../../shared/types/product"
import useCartStore from "../../cart/store/cart.store"

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const imagen = product.imagenes_url[0] ?? "/placeholder.jpg"
  const categoria = product.categorias.find((c) => c.es_principal)?.categoria.nombre
  // reccore el array y apenas encuentre alrgeno devuelve trure.
  const tieneAlergenos = product.ingredientes.some((i) => i.ingrediente.es_alergeno)

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

        {/* visible solo si algún ingrediente es alérgeno */}
        {tieneAlergenos && (
          <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full w-fit">
            Contiene alérgenos
          </span>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-orange font-bold text-lg">
            ${product.precio_base}
            
            {product.unidad_venta && (
              //text-sm para achicar el simbolo y que se vea bonito y font-normal para no heredar la negrita
              <span className="text-sm font-normal text-text-muted">
                {/* se agrega un espacio porque sino el kg queda pegado */}
                {" "}/ {product.unidad_venta.simbolo}
              </span>
            )}
          </span>

          {/* se desactivo el producto manualmente */}
          {!product.disponible ? (
            <span className="text-xs text-text-muted font-semibold">No disponible</span>
          ) : product.stock_cantidad === 0 ? (
            /* disponible=true pero se agotó el stock */
            <span className="text-xs text-danger font-semibold">Sin stock</span>
          ) : (
            <button onClick={() => addItem(product)} className="bg-obsidian text-text-on-dark text-sm font-semibold px-4 py-2 rounded-xl hover:bg-orange transition-colors">
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
