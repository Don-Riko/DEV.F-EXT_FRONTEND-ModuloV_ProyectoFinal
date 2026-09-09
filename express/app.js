import express from 'express'

/**
 * Aplicación de Express de ChatGPDevf.
 *
 * Se exporta la instancia `app` (sin llamar a listen) para poder reutilizarla
 * tanto en el arranque local (index.js) como en el entorno serverless de
 * Vercel (api/index.js).
 */
export const app = express()

app.use(express.json())

// CORS explícito.
//
// En el entorno serverless de Vercel el middleware `cors` no siempre añade
// la cabecera Access-Control-Allow-Origin a las respuestas reales (GET/POST),
// lo que provoca que el navegador bloquee la lectura y el frontend lo
// interprete como "sin conexión". Para evitarlo, se establecen las cabeceras
// CORS manualmente en todas las respuestas y se responde el preflight OPTIONS.
//
// Se refleja el origen que envía el navegador (o "*" si no hay Origin, p. ej.
// peticiones con curl). La API es pública, por lo que no se restringe por
// origen.
app.use((req, res, next) => {
  const origen = req.headers.origin
  res.setHeader('Access-Control-Allow-Origin', origen || '*')
  res.setHeader('Vary', 'Origin')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Responde de inmediato a las peticiones de verificación previa (preflight).
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  next()
})

// Configuración de Ollama (opcional). Si no está accesible, se usa un modo
// de respaldo (mock) para que la interacción funcione en cualquier entorno,
// incluido el free-tier de Vercel, que no puede alojar el modelo.
const OLLAMA_URL =
  process.env.OLLAMA_URL ?? 'http://localhost:11434/api/generate'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'deepseek-r1:1.5b'
// Tiempo máximo de espera para Ollama antes de recurrir al modo mock.
const OLLAMA_TIMEOUT = Number(process.env.OLLAMA_TIMEOUT ?? 20000)

/**
 * Genera una respuesta de respaldo (mock) cuando Ollama no está disponible.
 * Mantiene la conversación funcional en entornos sin el modelo (p. ej. Vercel).
 */
function respuestaMock(prompt) {
  return (
    `🤖 (modo demostración) Recibí tu mensaje: "${prompt}".\n\n` +
    'El modelo de IA local (Ollama + deepseek-r1) no está disponible en este ' +
    'entorno. Ejecuta el backend en local con Ollama para obtener respuestas ' +
    'generadas por el modelo.'
  )
}

/**
 * Intenta obtener una respuesta de Ollama. Devuelve null si no está disponible.
 */
async function generarConOllama(prompt) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT)
  try {
    const res = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
      signal: controller.signal,
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.response ?? null
  } catch {
    // Ollama no accesible (ECONNREFUSED, timeout, etc.).
    return null
  } finally {
    clearTimeout(timeout)
  }
}

// Endpoint de estado del servicio.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', servicio: 'chatgpdevf-backend' })
})

// Mantiene el "Hola Mundo" original de la Parte 4.
app.get('/', (req, res) => {
  res.send('Hola Mundo')
})

/**
 * Endpoint de chat.
 *
 * Recibe { prompt } y responde { response, fuente }.
 * - fuente 'ollama': respuesta generada por el modelo local.
 * - fuente 'mock':   respuesta de respaldo cuando Ollama no está disponible.
 */
app.post('/api/chat', async (req, res) => {
  const prompt = req.body?.prompt?.trim()
  if (!prompt) {
    return res.status(400).json({ error: 'El campo "prompt" es obligatorio.' })
  }

  const respuestaOllama = await generarConOllama(prompt)
  if (respuestaOllama !== null) {
    return res.json({ response: respuestaOllama, fuente: 'ollama' })
  }

  return res.json({ response: respuestaMock(prompt), fuente: 'mock' })
})

export default app
