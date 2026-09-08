import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContext.js'

const CLAVE_ALMACEN = 'chatgpdevf-theme'

/**
 * Determina el tema inicial: primero el guardado en localStorage y, si no
 * existe, la preferencia del sistema operativo.
 */
function temaInicial() {
  if (typeof window === 'undefined') return 'dark'
  const guardado = window.localStorage.getItem(CLAVE_ALMACEN)
  if (guardado === 'light' || guardado === 'dark') return guardado
  const prefiereClaro =
    window.matchMedia?.('(prefers-color-scheme: light)').matches
  return prefiereClaro ? 'light' : 'dark'
}

/**
 * Proveedor del tema. Envuelve la aplicación y expone, mediante el contexto,
 * el tema activo y las funciones para alternarlo o fijarlo.
 *
 * Usa useState para el estado del tema y useEffect para persistirlo en
 * localStorage y reflejarlo en el atributo data-theme del documento.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(temaInicial)

  useEffect(() => {
    window.localStorage.setItem(CLAVE_ALMACEN, theme)
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  const toggleTheme = useCallback(
    () => setTheme((actual) => (actual === 'dark' ? 'light' : 'dark')),
    [],
  )

  const valor = useMemo(
    () => ({
      theme,
      esOscuro: theme === 'dark',
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme],
  )

  return (
    <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>
  )
}

export default ThemeProvider
