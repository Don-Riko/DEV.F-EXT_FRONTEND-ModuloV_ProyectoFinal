import { useChat } from '../context/useChat.js'

/**
 * Componente History.
 *
 * Muestra el listado de conversaciones previas guardadas en el estado
 * global. Permite recuperar una conversación para continuarla o eliminarla
 * del historial.
 */
function History() {
  const { historial, cargarConversacion, eliminarDelHistorial } = useChat()

  const formatearFecha = (iso) =>
    new Date(iso).toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Historial
      </h2>

      {historial.length === 0 ? (
        <p className="text-sm text-slate-500">
          Aún no hay conversaciones guardadas.
        </p>
      ) : (
        <ul className="space-y-2 overflow-y-auto">
          {historial.map((conversacion) => (
            <li
              key={conversacion.id}
              className="group flex items-start justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900/60 p-2 hover:border-indigo-500/60"
            >
              <button
                type="button"
                onClick={() => cargarConversacion(conversacion.id)}
                className="flex-1 text-left"
                title="Recuperar esta conversación"
              >
                <span className="block truncate text-sm text-slate-200">
                  {conversacion.titulo}
                </span>
                <span className="block text-xs text-slate-500">
                  {formatearFecha(conversacion.fecha)} ·{' '}
                  {conversacion.mensajes.length} mensajes
                </span>
              </button>
              <button
                type="button"
                onClick={() => eliminarDelHistorial(conversacion.id)}
                className="shrink-0 rounded p-1 text-slate-500 opacity-0 transition hover:text-red-400 group-hover:opacity-100"
                title="Eliminar del historial"
                aria-label="Eliminar del historial"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default History
