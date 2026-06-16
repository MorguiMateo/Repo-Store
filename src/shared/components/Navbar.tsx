import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"

import useAuthStore from "../../modules/auth/store/auth.store"
import useCartStore from "../../modules/cart/store/cart.store"
import EditProfileModal from "../../modules/auth/components/EditProfileModal"
import instance from "../api/axios.instance"

export default function Navbar() {
  const user = useAuthStore((state) => state.user)
  const clearUser = useAuthStore((state) => state.clearUser)
  const cartItems = useCartStore((s) => s.items)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await instance.post("/auth/logout")
    } finally {
      clearUser()
      setDropdownOpen(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/?q=${encodeURIComponent(searchInput)}`)
  }

  return (
    <header className="bg-bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-16 h-16 flex items-center justify-between gap-8">

        <Link to="/" className="text-text-primary font-bold text-xl shrink-0">
          Obsidian Gourmet
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-sm font-semibold text-orange" : "text-sm text-text-primary"
            }
          >
            Productos
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              isActive ? "text-sm font-semibold text-orange" : "text-sm text-text-primary"
            }
          >
            Pedidos
          </NavLink>
        </nav>

        <div className="flex items-center gap-4 ml-auto">

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex bg-bg-elevated border border-border rounded-full px-4 h-9">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar productos..."
              className="bg-transparent text-sm text-text-primary placeholder-text-muted outline-none w-48"
            />
          </form>

          {/* Carrito */}
          <NavLink to="/cart" className="relative text-text-primary">
            {/* Heroicons */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </NavLink>

          {/* Usuario */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-obsidian text-white flex items-center justify-center"
              >
                {/* Heroicons */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-bg-surface border border-border rounded-xl shadow-lg py-2 z-50">
                  <p className="px-4 py-2 text-sm font-semibold text-text-primary truncate">{user.nombre}</p>
                  <p className="px-4 pb-2 text-xs text-text-muted truncate">{user.email}</p>
                  <hr className="border-border" />
                  <button
                    onClick={() => {
                      setEditOpen(true)
                      setDropdownOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-elevated transition-colors"
                  >
                    Editar perfil
                  </button>
                  <Link
                    to="/direcciones"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-text-primary hover:bg-bg-elevated transition-colors"
                  >
                    Mis direcciones
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-danger"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-sm text-text-primary">
              Ingresar
            </Link>
          )}

        </div>
      </div>

      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} />}
    </header>
  )
}
