import { useCallback, useMemo, useState } from 'react'
import { UserContext } from './UserContext.js'

/**
 * Calcula las iniciales a partir del nombre completo.
 * "Ada Lovelace" -> "AL"; "Ada" -> "A".
 */
export function calcularIniciales(nombre = '') {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean)
  if (palabras.length === 0) return '?'
  if (palabras.length === 1) return palabras[0][0].toUpperCase()
  return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase()
}

/**
 * Proveedor del usuario. Gestiona el perfil creado en el registro con
 * useState y expone acciones para registrar y cerrar sesión mediante el
 * contexto (useContext).
 */
export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  // Guarda el perfil (nombre y correo) tras el registro.
  const registrar = useCallback(({ nombre, email }) => {
    setUsuario({ nombre, email, iniciales: calcularIniciales(nombre) })
  }, [])

  const cerrarSesion = useCallback(() => setUsuario(null), [])

  const valor = useMemo(
    () => ({
      usuario,
      autenticado: usuario !== null,
      registrar,
      cerrarSesion,
    }),
    [usuario, registrar, cerrarSesion],
  )

  return <UserContext.Provider value={valor}>{children}</UserContext.Provider>
}

export default UserProvider
