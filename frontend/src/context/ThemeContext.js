import { createContext } from 'react'

/**
 * Contexto de tema (claro/oscuro).
 *
 * Se crea con createContext para poder compartir el tema activo y la
 * función para alternarlo en toda la aplicación sin pasar props manualmente
 * (evita el "prop drilling").
 */
export const ThemeContext = createContext(null)
