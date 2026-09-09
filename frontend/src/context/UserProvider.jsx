import { useCallback, useEffect, useMemo, useState } from 'react'
import { UserContext } from './UserContext.js'
import { calcularIniciales } from './iniciales.js'

const CLAVE_USUARIOS = 'chatgpdevf-usuarios'
const CLAVE_SESION = 'chatgpdevf-sesion'

/** Lee y parsea un valor de localStorage de forma segura. */
function leerAlmacen(clave, porDefecto) {
  if (typeof window === 'undefined') return porDefecto
  try {
    const crudo = window.localStorage.getItem(clave)
    return crudo ? JSON.parse(crudo) : porDefecto
  } catch {
    return porDefecto
  }
}

/** Construye el perfil público (sin contraseña) a partir de un registro. */
function aPerfil({ nombre, email }) {
  return { nombre, email, iniciales: calcularIniciales(nombre) }
}

/**
 * Proveedor del usuario.
 *
 * Persiste en localStorage la lista de usuarios registrados y la sesión
 * activa, de modo que al volver a entrar no haga falta registrarse de nuevo.
 * Expone acciones de registro, inicio y cierre de sesión mediante useContext.
 *
 * Nota: almacenar credenciales en el navegador es solo para fines educativos
 * (no hay backend de autenticación). La contraseña nunca sale del provider.
 */
export function UserProvider({ children }) {
  // Lista de usuarios registrados: [{ nombre, email, password }]
  const [usuarios, setUsuarios] = useState(() => leerAlmacen(CLAVE_USUARIOS, []))
  // Perfil de la sesión activa (sin contraseña) o null.
  const [usuario, setUsuario] = useState(() => leerAlmacen(CLAVE_SESION, null))

  // Persiste los usuarios registrados.
  useEffect(() => {
    window.localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
  }, [usuarios])

  // Persiste la sesión activa.
  useEffect(() => {
    if (usuario) {
      window.localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
    } else {
      window.localStorage.removeItem(CLAVE_SESION)
    }
  }, [usuario])

  /**
   * Registra un nuevo usuario y abre su sesión.
   * @returns {{ ok: boolean, error?: string }}
   */
  const registrar = useCallback(
    ({ nombre, email, password }) => {
      const correo = email.trim().toLowerCase()
      const existe = usuarios.some((u) => u.email.toLowerCase() === correo)
      if (existe) {
        return { ok: false, error: 'Ya existe una cuenta con ese correo.' }
      }
      const nuevo = { nombre: nombre.trim(), email: email.trim(), password }
      setUsuarios((prev) => [...prev, nuevo])
      setUsuario(aPerfil(nuevo))
      return { ok: true }
    },
    [usuarios],
  )

  /**
   * Inicia sesión validando las credenciales contra los usuarios guardados.
   * @returns {{ ok: boolean, error?: string }}
   */
  const iniciarSesion = useCallback(
    ({ email, password }) => {
      const correo = email.trim().toLowerCase()
      const encontrado = usuarios.find(
        (u) => u.email.toLowerCase() === correo,
      )
      if (!encontrado) {
        return { ok: false, error: 'No existe una cuenta con ese correo.' }
      }
      if (encontrado.password !== password) {
        return { ok: false, error: 'Contraseña incorrecta.' }
      }
      setUsuario(aPerfil(encontrado))
      return { ok: true }
    },
    [usuarios],
  )

  const cerrarSesion = useCallback(() => setUsuario(null), [])

  const valor = useMemo(
    () => ({
      usuario,
      autenticado: usuario !== null,
      // Indica si hay al menos una cuenta registrada (para decidir la
      // pantalla inicial: login por defecto o registro si no hay ninguna).
      hayUsuarios: usuarios.length > 0,
      registrar,
      iniciarSesion,
      cerrarSesion,
    }),
    [usuario, usuarios.length, registrar, iniciarSesion, cerrarSesion],
  )

  return <UserContext.Provider value={valor}>{children}</UserContext.Provider>
}

export default UserProvider
