import useAuthStore from "../../modules/auth/store/auth.store"
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
    const user = useAuthStore((state) => state.user)

    if (!user) return <Navigate to="/login" replace />

    return <Outlet />
}

//Outlet = pagina hija que inyecta el router.