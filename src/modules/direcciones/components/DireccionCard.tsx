import { useDeleteDireccion, useSetPrincipal } from "../hooks/useDirecciones"
import type { Direccion } from "../../../shared/types/direccion"

interface DireccionCardProps {
  direccion: Direccion
  onEdit: (direccion: Direccion) => void
}

export default function DireccionCard({ direccion, onEdit }: DireccionCardProps) {
  const { mutate: deleteDireccion, isPending: isDeleting } = useDeleteDireccion()
  const { mutate: setPrincipal, isPending: isSettingPrincipal } = useSetPrincipal()

  const handleDelete = () => {
    if (confirm("¿Eliminar esta dirección?")) {
      deleteDireccion(direccion.id)
    }
  }

  //segunda linea con los datos que esten cargados (provincia, codigo postal)
  const detalle = [direccion.provincia, direccion.codigo_postal].filter(Boolean).join(" · ")

  return (
    <div className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-text-primary">{direccion.alias || direccion.linea1}</p>
            {direccion.es_principal && (
              <span className="text-xs font-semibold text-orange border border-orange/40 rounded-full px-2 py-0.5">
                Principal
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary">{direccion.linea1}</p>
          {direccion.linea2 && <p className="text-sm text-text-secondary">{direccion.linea2}</p>}
          <p className="text-sm text-text-muted">
            {direccion.ciudad}
            {detalle && ` · ${detalle}`}
          </p>
        </div>
      </div>

      <div className="flex gap-3 border-t border-border pt-3">
        {!direccion.es_principal && (
          <button
            onClick={() => setPrincipal(direccion.id)}
            disabled={isSettingPrincipal}
            className="text-sm text-text-secondary hover:text-orange transition-colors disabled:opacity-50"
          >
            Marcar principal
          </button>
        )}
        <button
          onClick={() => onEdit(direccion)}
          className="text-sm text-text-secondary hover:text-orange transition-colors"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-sm text-danger hover:underline transition-colors disabled:opacity-50 ml-auto"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
