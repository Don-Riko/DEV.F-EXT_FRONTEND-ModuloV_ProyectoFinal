import { useChat } from '../context/useChat.js'
import { useTheme } from '../context/useTheme.js'

/**
 * Componente History.
 *
 * Muestra el listado de conversaciones previas guardadas en el estado
 * global. Permite recuperar una conversación para continuarla o eliminarla
 * del historial. Consume el tema activo mediante useTheme (useContext).
 */
function History() {
  const { historial, cargarConversacion, eliminarDelHistorial } = useChat()
  const { esOscuro } = useTheme()

  const formatearFecha = (iso) =>
    new Date(iso).toLocaleString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })

  const t = {
    panel: esOscuro
      ? 'border-slate-700 bg-slate-800/60'
      : 'border-slate-300 bg-white',
    titulo: esOscuro ? 'text-slate-400' : 'text-slate-500',
    vacio: esOscuro ? 'text-slate-500' : 'text-slate-400',
    item: esOscuro
      ? 'border-slate-700 bg-slate-900/60'
      : 'border-slate-200 bg-slate-50',
    itemTitulo: esOscuro ? 'text-slate-200' : 'text-slate-800',
    itemFecha: esOscuro ? 'text-slate-500' : 'text-slate-400',
  }

  return (
    <aside className={`flex h-full flex-col rounded-2xl border p-4 ${t.panel}`}>
      <h2 className={`mb-3 text-sm font-semibold uppercase tracking-wide ${t.titulo}`}>
        Historial
      </h2>

      {historial.length === 0 ? (
        <p className={`text-sm ${t.vacio}`}>
          Aún no hay conversaciones guardadas.
        </p>
      ) : (
        <ul className="space-y-2 overflow-y-auto">
          {historial.map((conversacion) => (
            <li
              key={conversacion.id}
              className={`group flex items-start justify-between gap-2 rounded-lg border p-2 hover:border-indigo-500/60 ${t.item}`}
            >
              <button
                type="button"
                onClick={() => cargarConversacion(conversacion.id)}
                className="flex-1 text-left"
                title="Recuperar esta conversación"
              >
                <span className={`block truncate text-sm ${t.itemTitulo}`}>
                  {conversacion.titulo}
                </span>
                <span className={`block text-xs ${t.itemFecha}`}>
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
