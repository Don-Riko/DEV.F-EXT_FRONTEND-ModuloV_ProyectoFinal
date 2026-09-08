import { createContext } from 'react'

/**
 * Contexto global del chat. Proporciona el estado (mensajes e historial)
 * y las acciones para manipularlo.
 */
export const ChatContext = createContext(null)
