import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUser } from '../context/useUser.js'

/**
 * Formulario de inicio de sesión clásico.
 *
 * Valida las credenciales contra los usuarios persistidos (localStorage) a
 * través del contexto de usuario. Incluye enlaces inferiores para crear una
 * cuenta nueva y para recuperar la contraseña.
 *
 * @param {object} props
 * @param {() => void} props.onCrearCuenta Navega a la pantalla de registro.
 */
function LoginForm({ onCrearCuenta }) {
  const { iniciarSesion } = useUser()
  const [avisoRecuperar, setAvisoRecuperar] = useState('')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const resultado = iniciarSesion(data)
    if (!resultado.ok) {
      // Muestra el error en el campo correspondiente.
      const campo = resultado.error?.includes('correo') ? 'email' : 'password'
      setError(campo, { type: 'manual', message: resultado.error })
    }
  }

  const onOlvidasteContrasena = () => {
    setAvisoRecuperar(
      'Recuperación de contraseña no disponible en esta versión de demostración.',
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl bg-slate-800/60 backdrop-blur border border-slate-700 shadow-xl p-6 sm:p-8 space-y-5"
    >
      {/* Email */}
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-slate-200 mb-1">
          Correo electrónico
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="ada@devf.com"
          className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
          {...register('email', {
            required: 'El correo es obligatorio',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Formato de correo inválido',
            },
          })}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-slate-200 mb-1">
          Contraseña
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
          {...register('password', { required: 'La contraseña es obligatoria' })}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Ingresando…' : 'Iniciar sesión'}
      </button>

      {avisoRecuperar && (
        <p className="text-center text-sm text-amber-400" role="status">
          {avisoRecuperar}
        </p>
      )}

      {/* Leyendas inferiores */}
      <div className="flex flex-col items-center gap-2 pt-1 text-sm">
        <button
          type="button"
          onClick={onCrearCuenta}
          className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
        >
          Crear cuenta nueva
        </button>
        <button
          type="button"
          onClick={onOlvidasteContrasena}
          className="text-slate-400 hover:text-slate-200 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </form>
  )
}

export default LoginForm
