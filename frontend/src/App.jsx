import Chat from './components/Chat.jsx'
import History from './components/History.jsx'
import RegisterForm from './components/RegisterForm.jsx'
import ProfileWidget from './components/ProfileWidget.jsx'
import { useTheme } from './context/useTheme.js'
import { useUser } from './context/useUser.js'

/** Botón para alternar el tema, reutilizado en ambas pantallas. */
function ThemeToggle() {
  const { esOscuro, toggleTheme } = useTheme()
  return (
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
  )
}

function App() {
  const { esOscuro } = useTheme()
  const { autenticado } = useUser()

  const fondo = esOscuro
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    : 'bg-gradient-to-br from-slate-100 via-white to-slate-200'
  const tituloColor = esOscuro ? 'text-white' : 'text-slate-900'
  const subtituloColor = esOscuro ? 'text-slate-400' : 'text-slate-600'

  // Pantalla 1: registro (mientras no haya un perfil creado).
  if (!autenticado) {
    return (
      <div className={`min-h-screen px-4 py-10 transition-colors ${fondo}`}>
        <div className="mx-auto w-full max-w-md">
          <div className="mb-4 flex justify-end">
            <ThemeToggle />
          </div>
          <header className="mb-8 text-center">
            <h1 className={`text-3xl font-bold ${tituloColor}`}>ChatGPDevf</h1>
            <p className={`mt-2 ${subtituloColor}`}>
              Crea tu cuenta para empezar a chatear con la IA
            </p>
          </header>
          <RegisterForm />
        </div>
      </div>
    )
  }

  // Pantalla 2: Dashboard del chatbot con widget de perfil.
  return (
    <div className={`min-h-screen px-4 py-6 transition-colors ${fondo}`}>
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold ${tituloColor}`}>ChatGPDevf</h1>
            <p className={`mt-1 text-sm ${subtituloColor}`}>
              Chat con IA · las peticiones se procesan en el backend
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ProfileWidget />
          </div>
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
