import { create } from "zustand"

interface User {
    id: number
    email: string
    nombre: string
    rol: string
}

interface AuthState {
    user: User | null
    setUser: (user: User) => void
    clearUser: () => void
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}))

export default useAuthStore