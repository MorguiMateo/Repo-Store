import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "../../../shared/types/product"
import type { CartItem } from "../../../shared/types/cart"

interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      //si no hay item en el carrito agrega 1. Si ya hay sube la cantidad +1
      addItem: (product) => {
        const existing = get().items.find((item) => item.id === product.id)
        if (existing) {
          set({
            items: get().items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({ items: [...get().items, { ...product, quantity: 1 }] })
        }
      },

      //con filter limpiamos el item
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      //se aplica sobre "+" "-" para directamente alterar la cantidad.
      //nos permite aumentar de 10 en 10 si hubiera un imput
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
)

export default useCartStore
