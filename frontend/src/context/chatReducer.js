/**
 * Reducer para el estado global del chat.
 *
 * El estado mantiene:
 * - `mensajes`: la conversación activa (array de {id, rol, contenido}).
 * - `historial`: lista de conversaciones previas guardadas.
 *
 * Cada mensaje tiene un `rol`: 'usuario' o 'ia'.
 */

export const estadoInicial = {
  mensajes: [],
  historial: [],
}

// Tipos de acción centralizados para evitar errores de escritura.
export const ACCIONES = {
  AGREGAR_MENSAJE: 'AGREGAR_MENSAJE',
  LIMPIAR_CONVERSACION: 'LIMPIAR_CONVERSACION',
  GUARDAR_EN_HISTORIAL: 'GUARDAR_EN_HISTORIAL',
  CARGAR_CONVERSACION: 'CARGAR_CONVERSACION',
  ELIMINAR_DEL_HISTORIAL: 'ELIMINAR_DEL_HISTORIAL',
}

let contadorId = 0
const nuevoId = () => `${Date.now()}-${contadorId++}`

export function chatReducer(estado, accion) {
  switch (accion.type) {
    case ACCIONES.AGREGAR_MENSAJE:
      return {
        ...estado,
        mensajes: [
          ...estado.mensajes,
          {
            id: nuevoId(),
            rol: accion.payload.rol,
            contenido: accion.payload.contenido,
          },
        ],
      }

    case ACCIONES.LIMPIAR_CONVERSACION:
      return { ...estado, mensajes: [] }

    case ACCIONES.GUARDAR_EN_HISTORIAL: {
      // No guarda conversaciones vacías.
      if (estado.mensajes.length === 0) return estado

      // El título es la primera consulta del usuario, recortada.
      const primerUsuario = estado.mensajes.find((m) => m.rol === 'usuario')
      const titulo = primerUsuario
        ? primerUsuario.contenido.slice(0, 40)
        : 'Conversación'

      const entrada = {
        id: nuevoId(),
        titulo,
        fecha: new Date().toISOString(),
        mensajes: estado.mensajes,
      }

      return {
        mensajes: [],
        historial: [entrada, ...estado.historial],
      }
    }

    case ACCIONES.CARGAR_CONVERSACION: {
      const conversacion = estado.historial.find(
        (c) => c.id === accion.payload.id,
      )
      if (!conversacion) return estado
      return { ...estado, mensajes: conversacion.mensajes }
    }

    case ACCIONES.ELIMINAR_DEL_HISTORIAL:
      return {
        ...estado,
        historial: estado.historial.filter(
          (c) => c.id !== accion.payload.id,
        ),
      }

    default:
      return estado
  }
}
