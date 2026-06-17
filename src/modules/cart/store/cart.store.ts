import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "../../../shared/types/product"
import type { CartItem } from "../../../shared/types/cart"

interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  // marca o desmarca un ingrediente como "a remover" en un item
  togglePersonalizacion: (itemId: number, ingredienteId: number) => void
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
          // personalizacion arranca vacío, el usuario lo edita en checkout
          set({ items: [...get().items, { ...product, quantity: 1, personalizacion: [] }] })
        }
      },

      //con filter limpiamos el item
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      //se aplica sobre "+" "-" para directamente alterar la cantidad.
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },

      togglePersonalizacion: (itemId, ingredienteId) => {
        set({
          // recorremos todos los items y modifica el que coincide con itemId
          items: get().items.map((item) => {
            if (item.id !== itemId) return item
            // vemos si el ingrediente ya estaba marcado
            const selected = item.personalizacion.includes(ingredienteId)
            return {
              ...item,
              // si estaba lo sacamos y si no estaba lo agregamos
              personalizacion: selected
                ? item.personalizacion.filter((id) => id !== ingredienteId)
                : [...item.personalizacion, ingredienteId],
            }
          }),
        })
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
)

export default useCartStore
