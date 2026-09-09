/**
 * Calcula las iniciales a partir del nombre completo.
 * "Ada Lovelace" -> "AL"; "Ada" -> "A".
 */
export function calcularIniciales(nombre = '') {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean)
  if (palabras.length === 0) return '?'
  if (palabras.length === 1) return palabras[0][0].toUpperCase()
  return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase()
}
