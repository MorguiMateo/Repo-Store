// Espeja DireccionPublic del backend (modules/direccion_entrega/schema.py).
export interface Direccion {
  id: number
  usuario_id: number
  alias: string | null
  linea1: string
  linea2: string | null
  ciudad: string
  provincia: string | null
  codigo_postal: string | null
  latitud: number | null
  longitud: number | null
  es_principal: boolean
  created_at: string
}

// Body de create/update. linea1 y ciudad son obligatorios en el back.
export interface DireccionPayload {
  alias?: string | null
  linea1: string
  linea2?: string | null
  ciudad: string
  provincia?: string | null
  codigo_postal?: string | null
  es_principal?: boolean
}
