import { useContext } from 'react'
import { ThemeContext } from './ThemeContext.js'

/**
 * Hook de conveniencia para consumir el ThemeContext con useContext.
 * Lanza un error si se usa fuera de un ThemeProvider.
 */
export function useTheme() {
  const contexto = useContext(ThemeContext)
  if (!contexto) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider')
  }
  return contexto
}
