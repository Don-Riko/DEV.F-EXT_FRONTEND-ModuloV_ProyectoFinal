import { useState } from 'react'
import { useForm } from 'react-hook-form'

/**
 * Formulario de registro con validación avanzada usando React Hook Form.
 *
 * Demuestra:
 * - Validaciones con `register` (required, minLength, maxLength, pattern).
 * - Validación cruzada entre campos (confirmar contraseña con `validate`).
 * - Estado de envío (`isSubmitting`) y errores por campo.
 * - Modo de validación "onBlur" para una mejor experiencia de usuario.
 */
function RegisterForm() {
  const [enviado, setEnviado] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      confirmarPassword: '',
      terminos: false,
    },
  })

  // Se observa el valor de password para validar la confirmación.
  const password = watch('password')

  const onSubmit = async (data) => {
    // Simula una petición asíncrona (por ejemplo, a un backend Express).
    await new Promise((resolve) => setTimeout(resolve, 800))
    // Nunca mostramos la contraseña de vuelta al usuario.
    setEnviado({ nombre: data.nombre, email: data.email })
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl bg-slate-800/60 backdrop-blur border border-slate-700 shadow-xl p-6 sm:p-8 space-y-5"
    >
      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-slate-200 mb-1">
          Nombre completo
        </label>
        <input
          id="nombre"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
          {...register('nombre', {
            required: 'El nombre es obligatorio',
            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            maxLength: { value: 50, message: 'Máximo 50 caracteres' },
          })}
          aria-invalid={errors.nombre ? 'true' : 'false'}
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.nombre.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1">
          Correo electrónico
        </label>
        <input
          id="email"
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
        <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            validate: {
              tieneMayuscula: (v) =>
                /[A-Z]/.test(v) || 'Debe incluir al menos una mayúscula',
              tieneNumero: (v) =>
                /[0-9]/.test(v) || 'Debe incluir al menos un número',
            },
          })}
          aria-invalid={errors.password ? 'true' : 'false'}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirmar Password */}
      <div>
        <label htmlFor="confirmarPassword" className="block text-sm font-medium text-slate-200 mb-1">
          Confirmar contraseña
        </label>
        <input
          id="confirmarPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
          {...register('confirmarPassword', {
            required: 'Confirma tu contraseña',
            validate: (v) =>
              v === password || 'Las contraseñas no coinciden',
          })}
          aria-invalid={errors.confirmarPassword ? 'true' : 'false'}
        />
        {errors.confirmarPassword && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.confirmarPassword.message}
          </p>
        )}
      </div>

      {/* Términos */}
      <div>
        <label className="flex items-start gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500/40"
            {...register('terminos', {
              required: 'Debes aceptar los términos y condiciones',
            })}
          />
          <span>Acepto los términos y condiciones</span>
        </label>
        {errors.terminos && (
          <p className="mt-1 text-sm text-red-400" role="alert">
            {errors.terminos.message}
          </p>
        )}
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={isSubmitting || !isValid}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Registrando…' : 'Crear cuenta'}
      </button>

      {/* Mensaje de éxito */}
      {enviado && (
        <div
          className="rounded-lg border border-emerald-600 bg-emerald-900/30 px-4 py-3 text-sm text-emerald-300"
          role="status"
        >
          ¡Cuenta creada, {enviado.nombre}! Te enviamos un correo a{' '}
          <span className="font-medium">{enviado.email}</span>.
        </div>
      )}
    </form>
  )
}

export default RegisterForm
