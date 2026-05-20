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
    categorias: ProductoCategoria[]
    ingredientes: ProductoIngrediente[]
    eliminado: boolean
  }