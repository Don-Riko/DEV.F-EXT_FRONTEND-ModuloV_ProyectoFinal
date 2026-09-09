import { createContext } from 'react'

/**
 * Contexto del usuario (perfil creado en el formulario de registro).
 * Comparte los datos del perfil y las acciones de sesión con toda la app.
 */
export const UserContext = createContext(null)
