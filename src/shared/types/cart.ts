import type { Product } from "./product"

export interface CartItem extends Product {
  quantity: number
  // IDs de ingredientes que el cliente quiere remover
  personalizacion: number[]
}