import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Configuración por defecto del servicio de Ollama.
 *
 * Ollama se ejecuta localmente y expone su API REST en el puerto 11434.
 * Se pueden sobrescribir estos valores con variables de entorno de Vite
 * (por ejemplo, VITE_OLLAMA_URL y VITE_OLLAMA_MODEL).
 */
const OLLAMA_URL =
  import.meta.env.VITE_OLLAMA_URL ?? 'http://localhost:11434/api/generate'
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL ?? 'deepseek-r1:1.5b'

/**
 * Custom hook para consumir el servicio de generación de texto de Ollama.
 *
 * Expone un estado reactivo (respuesta, cargando, error, disponibilidad) y
 * una función `enviarPrompt` para solicitar una respuesta al modelo.
 *
 * Usa `useEffect` para comprobar la disponibilidad del servicio al montar
 * el componente y `AbortController` para cancelar peticiones pendientes al
 * desmontar, evitando actualizaciones de estado sobre componentes ya
 * desmontados.
 *
 * @param {object} [opciones]
 * @param {string} [opciones.url]   URL del endpoint de generación.
 * @param {string} [opciones.model] Modelo a utilizar.
 */
export function useOllama({ url = OLLAMA_URL, model = OLLAMA_MODEL } = {}) {
  const [respuesta, setRespuesta] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  // null = comprobando, true = disponible, false = no disponible
  const [disponible, setDisponible] = useState(null)

  // Referencia para abortar peticiones al desmontar el componente.
  const abortRef = useRef(null)

  // Al montar: comprueba si el servicio de Ollama responde.
  useEffect(() => {
    const controller = new AbortController()
    // El endpoint base (sin /api/generate) responde con "Ollama is running".
    const baseUrl = url.replace(/\/api\/.*$/, '')

    async function comprobarDisponibilidad() {
      try {
        const res = await fetch(baseUrl, { signal: controller.signal })
        setDisponible(res.ok)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setDisponible(false)
        }
      }
    }

    comprobarDisponibilidad()
    return () => controller.abort()
  }, [url])

  // Limpia cualquier petición pendiente al desmontar.
  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  /**
   * Envía un prompt al modelo y devuelve la respuesta generada.
   * @param {string} prompt Texto de la consulta del usuario.
   * @returns {Promise<string>} La respuesta del modelo.
   */
  const enviarPrompt = useCallback(
    async (prompt) => {
      if (!prompt?.trim()) return ''

      // Cancela una petición anterior si sigue en curso.
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setCargando(true)
      setError(null)
      setRespuesta('')

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // stream:false devuelve la respuesta completa en un solo JSON.
          body: JSON.stringify({ model, prompt, stream: false }),
          signal: controller.signal,
        })

        if (!res.ok) {
          throw new Error(`El servicio respondió con estado ${res.status}`)
        }

        const data = await res.json()
        const texto = data.response ?? ''
        setRespuesta(texto)
        setDisponible(true)
        return texto
      } catch (err) {
        if (err.name === 'AbortError') return ''
        const mensaje =
          err.message?.includes('Failed to fetch') || err.name === 'TypeError'
            ? 'No se pudo conectar con Ollama. Asegúrate de que esté ejecutándose en tu equipo (ollama serve) y que el modelo esté descargado.'
            : err.message
        setError(mensaje)
        setDisponible(false)
        throw new Error(mensaje)
      } finally {
        setCargando(false)
      }
    },
    [url, model],
  )

  return { respuesta, cargando, error, disponible, model, enviarPrompt }
}

export default useOllama
