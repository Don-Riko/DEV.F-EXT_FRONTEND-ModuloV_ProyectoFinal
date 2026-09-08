import { useContext } from 'react'
import { ChatContext } from './ChatContext.js'

/**
 * Hook de conveniencia para acceder al contexto del chat.
 * Lanza un error si se usa fuera de un ChatProvider.
 */
export function useChat() {
  const contexto = useContext(ChatContext)
  if (!contexto) {
    throw new Error('useChat debe usarse dentro de un ChatProvider')
  }
  return contexto
}
