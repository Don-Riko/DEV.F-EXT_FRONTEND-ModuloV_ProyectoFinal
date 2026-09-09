import { useCallback, useMemo, useReducer } from 'react'
import { ChatContext } from './ChatContext.js'
import { chatReducer, estadoInicial, ACCIONES } from './chatReducer.js'
import { useOllama } from '../hooks/useOllama.js'

/**
 * Proveedor del estado global del chat.
 *
 * Combina `useReducer` (para el estado de mensajes e historial) con el
 * custom hook `useOllama` (para la comunicación con la IA), y expone una
 * API sencilla a través del contexto.
 */
export function ChatProvider({ children }) {
  const [estado, dispatch] = useReducer(chatReducer, estadoInicial)
  const { cargando, error, disponible, fuente, enviarPrompt } = useOllama()

  // Envía la consulta del usuario y agrega la respuesta de la IA.
  const preguntar = useCallback(
    async (texto) => {
      const contenido = texto?.trim()
      if (!contenido) return

      dispatch({
        type: ACCIONES.AGREGAR_MENSAJE,
        payload: { rol: 'usuario', contenido },
      })

      try {
        const respuesta = await enviarPrompt(contenido)
        dispatch({
          type: ACCIONES.AGREGAR_MENSAJE,
          payload: { rol: 'ia', contenido: respuesta || '(sin respuesta)' },
        })
      } catch (err) {
        dispatch({
          type: ACCIONES.AGREGAR_MENSAJE,
          payload: { rol: 'ia', contenido: `⚠️ ${err.message}` },
        })
      }
    },
    [enviarPrompt],
  )

  const limpiarConversacion = useCallback(
    () => dispatch({ type: ACCIONES.LIMPIAR_CONVERSACION }),
    [],
  )

  const guardarEnHistorial = useCallback(
    () => dispatch({ type: ACCIONES.GUARDAR_EN_HISTORIAL }),
    [],
  )

  const cargarConversacion = useCallback(
    (id) => dispatch({ type: ACCIONES.CARGAR_CONVERSACION, payload: { id } }),
    [],
  )

  const eliminarDelHistorial = useCallback(
    (id) =>
      dispatch({ type: ACCIONES.ELIMINAR_DEL_HISTORIAL, payload: { id } }),
    [],
  )

  const valor = useMemo(
    () => ({
      mensajes: estado.mensajes,
      historial: estado.historial,
      cargando,
      error,
      disponible,
      fuente,
      preguntar,
      limpiarConversacion,
      guardarEnHistorial,
      cargarConversacion,
      eliminarDelHistorial,
    }),
    [
      estado.mensajes,
      estado.historial,
      cargando,
      error,
      disponible,
      fuente,
      preguntar,
      limpiarConversacion,
      guardarEnHistorial,
      cargarConversacion,
      eliminarDelHistorial,
    ],
  )

  return <ChatContext.Provider value={valor}>{children}</ChatContext.Provider>
}

export default ChatProvider
