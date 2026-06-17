import { useState } from "react"
import { useCreateDireccion, useUpdateDireccion } from "../hooks/useDirecciones"
import type { Direccion, DireccionPayload } from "../../../shared/types/direccion"

interface DireccionFormModalProps {
  //si viene una direccion el modal edita, si no crea una nueva
  direccion?: Direccion
  onClose: () => void
  //le avisa al que lo abrio cual fue la direccion que se guardo (ej: para seleccionarla)
  onSaved?: (direccion: Direccion) => void
}

export default function DireccionFormModal({ direccion, onClose, onSaved }: DireccionFormModalProps) {
  const esEdicion = Boolean(direccion)

  const [alias, setAlias] = useState(direccion?.alias ?? "")
  const [linea1, setLinea1] = useState(direccion?.linea1 ?? "")
  const [linea2, setLinea2] = useState(direccion?.linea2 ?? "")
  const [ciudad, setCiudad] = useState(direccion?.ciudad ?? "")
  const [provincia, setProvincia] = useState(direccion?.provincia ?? "")
  const [codigoPostal, setCodigoPostal] = useState(direccion?.codigo_postal ?? "")
  const [esPrincipal, setEsPrincipal] = useState(direccion?.es_principal ?? false)

  const { mutate: createDireccion, isPending: isCreating, isError: createError } = useCreateDireccion()
  const { mutate: updateDireccion, isPending: isUpdating, isError: updateError } = useUpdateDireccion()

  const isPending = isCreating || isUpdating
  const isError = createError || updateError

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    //los campos opcionales que quedan vacios los mandamos como null, asi no guardamos strings vacios
    const payload: DireccionPayload = {
      alias: alias.trim() === "" ? null : alias.trim(),
      linea1: linea1.trim(),
      linea2: linea2.trim() === "" ? null : linea2.trim(),
      ciudad: ciudad.trim(),
      provincia: provincia.trim() === "" ? null : provincia.trim(),
      codigo_postal: codigoPostal.trim() === "" ? null : codigoPostal.trim(),
      es_principal: esPrincipal,
    }

    const onSuccess = (saved: Direccion) => {
      onSaved?.(saved)
      onClose()
    }

    if (direccion) {
      updateDireccion({ id: direccion.id, data: payload }, { onSuccess })
    } else {
      createDireccion(payload, { onSuccess })
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-surface border border-border rounded-2xl p-8 w-full max-w-md flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">
            {esEdicion ? "Editar dirección" : "Nueva dirección"}
          </h2>
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
            <label className="text-sm text-text-secondary">Alias</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              maxLength={50}
              placeholder="Casa, Trabajo... (opcional)"
              className="bg-bg-elevated border border-border rounded-xl px-4 py-2 text-text-primary placeholder-text-muted outline-none focus:border-orange transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Dirección</label>
            <input
              type="text"
              value={linea1}
              onChange={(e) => setLinea1(e.target.value)}
              required
              placeholder="Calle y número"
              className="bg-bg-elevated border border-border rounded-xl px-4 py-2 text-text-primary placeholder-text-muted outline-none focus:border-orange transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Piso / Depto</label>
            <input
              type="text"
              value={linea2}
              onChange={(e) => setLinea2(e.target.value)}
              placeholder="Opcional"
              className="bg-bg-elevated border border-border rounded-xl px-4 py-2 text-text-primary placeholder-text-muted outline-none focus:border-orange transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Ciudad</label>
            <input
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              required
              maxLength={100}
              className="bg-bg-elevated border border-border rounded-xl px-4 py-2 text-text-primary outline-none focus:border-orange transition-colors"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Provincia</label>
              <input
                type="text"
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                maxLength={100}
                placeholder="Opcional"
                className="bg-bg-elevated border border-border rounded-xl px-4 py-2 text-text-primary placeholder-text-muted outline-none focus:border-orange transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm text-text-secondary">Código postal</label>
              <input
                type="text"
                value={codigoPostal}
                onChange={(e) => setCodigoPostal(e.target.value)}
                maxLength={10}
                placeholder="Opcional"
                className="bg-bg-elevated border border-border rounded-xl px-4 py-2 text-text-primary placeholder-text-muted outline-none focus:border-orange transition-colors"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={esPrincipal}
              onChange={(e) => setEsPrincipal(e.target.checked)}
              className="accent-orange"
            />
            <span className="text-sm text-text-secondary">Usar como dirección principal</span>
          </label>

          {isError && (
            <p className="text-danger text-sm">No se pudo guardar la dirección. Intentá de nuevo.</p>
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
