export interface UnidadMedida {
  id: number
  nombre: string
  simbolo: string
}

export interface Categoria {
    id: number
    nombre: string
    descripcion: string | null
    imagen_url: string | null
    parent_id: number | null
  }

  export interface Ingrediente {
    id: number
    nombre: string
    descripcion: string | null
    es_alergeno: boolean
  }

  export interface ProductoCategoria {
    categoria: Categoria
    es_principal: boolean
  }

  export interface ProductoIngrediente {
    ingrediente: Ingrediente
    es_removible: boolean
  }

  export interface Product {
    id: number
    nombre: string
    descripcion: string | null
    precio_base: number
    imagenes_url: string[]
    stock_cantidad: number
    disponible: boolean
    /*Es null porque en el uml el campo unidad_venta_id es null. 
    Un producto como "empanada" no tiene unidad, simplemente cuesta $3 por pieza. 
    Un producto como "carne" sí tiene unidad ("kg"). El | null le dice a TypeScript 
    que hay que chequear si existe antes de usarlo. */
    unidad_venta: UnidadMedida | null
    categorias: ProductoCategoria[]
    ingredientes: ProductoIngrediente[]
    created_at: string
    updated_at: string
    deleted_at: string | null
  }