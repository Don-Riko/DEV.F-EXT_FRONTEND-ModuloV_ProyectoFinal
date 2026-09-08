import Chat from './components/Chat.jsx'
import History from './components/History.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">ChatGPDevf</h1>
          <p className="mt-1 text-slate-400">
            Chat con IA local usando Ollama y el modelo deepseek-r1
          </p>
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
