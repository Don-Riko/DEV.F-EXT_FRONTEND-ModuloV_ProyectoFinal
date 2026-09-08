import RegisterForm from './components/RegisterForm.jsx'

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">ChatGPDevf</h1>
          <p className="mt-2 text-slate-400">
            Crea tu cuenta para empezar a chatear con la IA
          </p>
        </header>
        <RegisterForm />
      </div>
    </main>
  )
}

export default App
