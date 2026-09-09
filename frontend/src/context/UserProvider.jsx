import { useCallback, useMemo, useState } from 'react'
import { UserContext } from './UserContext.js'
import { calcularIniciales } from './iniciales.js'

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
