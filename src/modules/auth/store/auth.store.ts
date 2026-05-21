import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: number
  email: string
  nombre: string
  apellido: string
  roles: string[]
}

interface AuthState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "auth-storage" }
  )
)

export default useAuthStore
