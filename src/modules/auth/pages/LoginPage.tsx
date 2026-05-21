import { useState } from "react"
import { useLogin } from "../hooks/useLogin"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { mutate: login, isPending, isError } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-bg-surface border border-border rounded-2xl p-8 w-full max-w-sm flex flex-col gap-6">

        <h1 className="text-2xl font-bold text-text-primary">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-bg-elevated border border-border rounded-xl px-4 py-2 text-text-primary outline-none focus:border-orange transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-secondary">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-bg-elevated border border-border rounded-xl px-4 py-2 text-text-primary outline-none focus:border-orange transition-colors"
            />
          </div>

          {isError && (
            <p className="text-danger text-sm">Email o contraseña incorrectos.</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="bg-obsidian text-text-on-dark font-semibold py-3 rounded-xl hover:bg-obsidian-soft transition-colors disabled:opacity-50"
          >
            {isPending ? "Ingresando..." : "Ingresar"}
          </button>

        </form>
      </div>
    </div>
  )
}
