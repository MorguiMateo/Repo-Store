import { useState } from "react"
import { useDirecciones } from "../hooks/useDirecciones"
import DireccionCard from "../components/DireccionCard"
import DireccionFormModal from "../components/DireccionFormModal"
import type { Direccion } from "../../../shared/types/direccion"

export default function DireccionesPage() {
  const { data: direcciones, isLoading, isError } = useDirecciones()

  // null = modal cerrado; undefined = abierto en modo "crear"; objeto = modo "editar".
  const [editando, setEditando] = useState<Direccion | undefined>(undefined)
  const [modalOpen, setModalOpen] = useState(false)

  const abrirCrear = () => {
    setEditando(undefined)
    setModalOpen(true)
  }

  const abrirEditar = (direccion: Direccion) => {
    setEditando(direccion)
    setModalOpen(true)
  }

  return (
    <div className="py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Mis direcciones</h1>
        <button
          onClick={abrirCrear}
          className="bg-obsidian text-text-on-dark font-semibold px-5 py-2.5 rounded-xl hover:bg-obsidian-soft transition-colors"
        >
          Agregar dirección
        </button>
      </div>

      {isLoading && <p className="text-center text-text-muted">Cargando direcciones...</p>}

      {isError && <p className="text-center text-danger">Error al cargar las direcciones.</p>}

      {direcciones && direcciones.length === 0 && (
        <div className="py-10 text-center">
          <p className="text-text-secondary mb-4">Todavía no cargaste ninguna dirección de entrega.</p>
          <button onClick={abrirCrear} className="text-orange font-semibold hover:underline">
            Agregar la primera
          </button>
        </div>
      )}

      {direcciones && direcciones.length > 0 && (
        <div className="flex flex-col gap-4">
          {direcciones.map((direccion) => (
            <DireccionCard key={direccion.id} direccion={direccion} onEdit={abrirEditar} />
          ))}
        </div>
      )}

      {modalOpen && (
        <DireccionFormModal direccion={editando} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
