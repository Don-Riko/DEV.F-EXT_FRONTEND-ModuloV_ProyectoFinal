import { useEffect, useRef, useState } from 'react'
import { useChat } from '../context/useChat.js'

/**
 * Limpia las etiquetas de razonamiento <think>...</think> que el modelo
 * deepseek-r1 incluye en su respuesta, dejando solo el texto final.
 */
function limpiarRespuesta(texto) {
  return texto.replace(/<think>[\s\S]*?<\/think>/g, '').trim() || texto
}

/**
 * Componente Chat.
 *
 * Renderiza la conversación activa (burbujas de usuario e IA), un campo de
 * entrada para enviar consultas y controles para limpiar o guardar la
 * conversación en el historial. Consume el estado global mediante useChat.
 */
function Chat() {
  const {
    mensajes,
    cargando,
    disponible,
    model,
    preguntar,
    limpiarConversacion,
    guardarEnHistorial,
  } = useChat()

  const [texto, setTexto] = useState('')
  const finRef = useRef(null)

  // Desplaza al último mensaje cuando la conversación cambia.
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, cargando])

  const onSubmit = async (e) => {
    e.preventDefault()
    const consulta = texto.trim()
    if (!consulta || cargando) return
    setTexto('')
    await preguntar(consulta)
  }

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-700 bg-slate-800/60">
      {/* Encabezado con estado de conexión */}
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              disponible === null
                ? 'bg-yellow-400'
                : disponible
                  ? 'bg-emerald-400'
                  : 'bg-red-400'
            }`}
            title={
              disponible === null
                ? 'Comprobando conexión con Ollama…'
                : disponible
                  ? 'Ollama conectado'
                  : 'Ollama no disponible'
            }
          />
          <span className="text-sm text-slate-400">
            Modelo: <span className="text-slate-200">{model}</span>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={guardarEnHistorial}
            disabled={mensajes.length === 0}
            className="rounded-md border border-slate-600 px-2.5 py-1 text-xs text-slate-300 transition hover:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={limpiarConversacion}
            disabled={mensajes.length === 0}
            className="rounded-md border border-slate-600 px-2.5 py-1 text-xs text-slate-300 transition hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {mensajes.length === 0 && (
          <p className="mt-10 text-center text-sm text-slate-500">
            Escribe tu primera consulta para comenzar a chatear con la IA.
          </p>
        )}

        {mensajes.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`flex ${
              mensaje.rol === 'usuario' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
                mensaje.rol === 'usuario'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-200 border border-slate-700'
              }`}
            >
              {mensaje.rol === 'ia'
                ? limpiarRespuesta(mensaje.contenido)
                : mensaje.contenido}
            </div>
          </div>
        ))}

        {cargando && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-400">
              La IA está pensando…
            </div>
          </div>
        )}
        <div ref={finRef} />
      </div>

      {/* Entrada */}
      <form
        onSubmit={onSubmit}
        className="flex gap-2 border-t border-slate-700 p-3"
      >
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe tu mensaje…"
          className="flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40"
        />
        <button
          type="submit"
          disabled={cargando || !texto.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </section>
  )
}

export default Chat
