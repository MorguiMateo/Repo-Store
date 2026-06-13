import { useState } from "react"
import { useUpdateProfile } from "../hooks/useUpdateProfile"
import useAuthStore from "../store/auth.store"

interface EditProfileModalProps {
  onClose: () => void
}

export default function EditProfileModal({ onClose }: EditProfileModalProps) {
  const user = useAuthStore((s) => s.user)

  const [nombre, setNombre] = useState(user?.nombre ?? "")
  const [apellido, setApellido] = useState(user?.apellido ?? "")
  const [celular, setCelular] = useState(user?.celular ?? "")

  const { mutate: updateProfile, isPending, isError } = useUpdateProfile()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(
      {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        // el back acepta null para limpiar el celular.
        celular: celular.trim() === "" ? null : celular.trim(),
      },
      { onSuccess: onClose }
    )
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-surface border border-border rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">Editar perfil</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              maxLength={80}
              className="bg-bg-elevated border border-border rounded-xl px-4 py-2 text-text-primary outline-none focus:border-orange transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
              maxLength={80}
              className="bg-bg-elevated border border-border rounded-xl px-4 py-2 text-text-primary outline-none focus:border-orange transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Celular</label>
            <input
              type="tel"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              maxLength={20}
              placeholder="Opcional"
              className="bg-bg-elevated border border-border rounded-xl px-4 py-2 text-text-primary placeholder-text-muted outline-none focus:border-orange transition-colors"
            />
          </div>

          {isError && (
            <p className="text-danger text-sm">No se pudieron guardar los cambios. Intentá de nuevo.</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border text-text-primary font-semibold py-3 rounded-xl hover:bg-bg-elevated transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-obsidian text-text-on-dark font-semibold py-3 rounded-xl hover:bg-obsidian-soft transition-colors disabled:opacity-50"
            >
              {isPending ? "Guardando..." : "Guardar"}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
