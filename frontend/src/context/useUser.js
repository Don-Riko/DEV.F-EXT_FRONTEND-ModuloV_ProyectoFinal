import { useContext } from 'react'
import { UserContext } from './UserContext.js'

/**
 * Hook de conveniencia para consumir el UserContext con useContext.
 * Lanza un error si se usa fuera de un UserProvider.
 */
export function useUser() {
  const contexto = useContext(UserContext)
  if (!contexto) {
    throw new Error('useUser debe usarse dentro de un UserProvider')
  }
  return contexto
}
