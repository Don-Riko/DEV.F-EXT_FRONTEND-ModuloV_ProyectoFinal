import { useState } from 'react'
import { useUser } from '../context/useUser.js'
import { useTheme } from '../context/useTheme.js'

/**
 * Widget de perfil del Dashboard.
 *
 * Muestra un círculo con las iniciales del usuario registrado. Al pulsarlo
 * despliega el nombre, el correo y la opción de cerrar sesión. Consume el
 * perfil desde el UserContext y el tema desde el ThemeContext (useContext).
 */
function ProfileWidget() {
  const { usuario, cerrarSesion } = useUser()
  const { esOscuro } = useTheme()
  const [abierto, setAbierto] = useState(false)

  if (!usuario) return null

  const panel = esOscuro
    ? 'border-slate-700 bg-slate-800 text-slate-200'
    : 'border-slate-300 bg-white text-slate-800'
  const tenue = esOscuro ? 'text-slate-400' : 'text-slate-500'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white shadow transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        title={usuario.nombre}
        aria-label="Perfil de usuario"
        aria-expanded={abierto}
      >
        {usuario.iniciales}
      </button>

      {abierto && (
        <div
          className={`absolute right-0 z-10 mt-2 w-56 rounded-xl border p-4 shadow-lg ${panel}`}
          role="menu"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
              {usuario.iniciales}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{usuario.nombre}</p>
              <p className={`truncate text-xs ${tenue}`}>{usuario.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={cerrarSesion}
            className="mt-4 w-full rounded-lg border border-red-500/60 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileWidget
