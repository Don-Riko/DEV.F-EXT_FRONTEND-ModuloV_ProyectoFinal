import Chat from './components/Chat.jsx'
import History from './components/History.jsx'
import { useTheme } from './context/useTheme.js'

function App() {
  // Consume el contexto de tema con useContext (vía useTheme).
  const { esOscuro, toggleTheme } = useTheme()

  return (
    <div
      className={`min-h-screen px-4 py-6 transition-colors ${
        esOscuro
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-slate-100 via-white to-slate-200'
      }`}
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <div className="text-center sm:text-left">
            <h1
              className={`text-3xl font-bold ${
                esOscuro ? 'text-white' : 'text-slate-900'
              }`}
            >
              ChatGPDevf
            </h1>
            <p
              className={`mt-1 text-sm ${
                esOscuro ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Chat con IA local usando Ollama y el modelo deepseek-r1
            </p>
          </div>

          {/* Botón para alternar el tema, consumiendo el contexto */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              esOscuro
                ? 'border-slate-600 bg-slate-800 text-slate-200 hover:border-indigo-500'
                : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-500'
            }`}
            title="Cambiar tema"
            aria-label="Cambiar tema"
          >
            {esOscuro ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </header>

        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          <div className="h-[70vh]">
            <History />
          </div>
          <div className="h-[70vh]">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
