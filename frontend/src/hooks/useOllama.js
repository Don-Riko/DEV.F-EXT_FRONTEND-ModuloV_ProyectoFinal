import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * URL base del backend. En desarrollo apunta al Express local; en producción
 * (GitHub Pages) se inyecta la URL pública del backend en Vercel mediante la
 * variable de entorno de Vite VITE_API_URL.
 */
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

/**
 * Custom hook para consumir la API de chat del backend.
 *
 * El backend centraliza la comunicación con la IA (modo dual Ollama/mock),
 * por lo que el frontend ya no llama a Ollama directamente.
 *
 * Usa `useEffect` para comprobar la disponibilidad del backend al montar
 * (endpoint /api/health) y `AbortController` para cancelar peticiones
 * pendientes, evitando actualizaciones sobre componentes desmontados.
 *
 * @param {object} [opciones]
 * @param {string} [opciones.apiUrl] URL base del backend.
 */
export function useOllama({ apiUrl = API_URL } = {}) {
  const [respuesta, setRespuesta] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  // null = comprobando, true = disponible, false = no disponible
  const [disponible, setDisponible] = useState(null)
  // Fuente de la última respuesta: 'ollama' | 'mock' | null
  const [fuente, setFuente] = useState(null)

  const abortRef = useRef(null)

  // Al montar: comprueba que el backend responde en /api/health.
  useEffect(() => {
    const controller = new AbortController()

    async function comprobarDisponibilidad() {
      try {
        const res = await fetch(`${apiUrl}/api/health`, {
          signal: controller.signal,
        })
        setDisponible(res.ok)
      } catch (err) {
        if (err.name !== 'AbortError') setDisponible(false)
      }
    }

    comprobarDisponibilidad()
    return () => controller.abort()
  }, [apiUrl])

  // Limpia cualquier petición pendiente al desmontar.
  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  /**
   * Envía un prompt al backend y devuelve la respuesta generada.
   * @param {string} prompt Texto de la consulta del usuario.
   * @returns {Promise<string>} La respuesta del backend.
   */
  const enviarPrompt = useCallback(
    async (prompt) => {
      if (!prompt?.trim()) return ''

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setCargando(true)
      setError(null)
      setRespuesta('')

      try {
        const res = await fetch(`${apiUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
          signal: controller.signal,
        })

        if (!res.ok) {
          throw new Error(`El servidor respondió con estado ${res.status}`)
        }

        const data = await res.json()
        const texto = data.response ?? ''
        setRespuesta(texto)
        setFuente(data.fuente ?? null)
        setDisponible(true)
        return texto
      } catch (err) {
        if (err.name === 'AbortError') return ''
        const mensaje =
          err.message?.includes('Failed to fetch') || err.name === 'TypeError'
            ? 'No se pudo conectar con el backend. Verifica que el servidor esté en ejecución o que VITE_API_URL apunte al backend desplegado.'
            : err.message
        setError(mensaje)
        setDisponible(false)
        throw new Error(mensaje)
      } finally {
        setCargando(false)
      }
    },
    [apiUrl],
  )

  return { respuesta, cargando, error, disponible, fuente, enviarPrompt }
}

export default useOllama
