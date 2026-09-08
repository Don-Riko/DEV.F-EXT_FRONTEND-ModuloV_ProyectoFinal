# ChatGPDevf — Frontend

Aplicación React + Vite con **Tailwind CSS v4** que integra un chat con IA
local mediante **Ollama** (modelo `deepseek-r1`). Proyecto final del Módulo V
(Frontend Avanzado) de DEV.F.

## Stack

- [React 19](https://react.dev/)
- [Vite 7](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (plugin oficial de Vite)
- [React Hook Form](https://react-hook-form.com/)
- [Ollama](https://ollama.com/) (servicio de IA local)

## Scripts

```bash
npm install     # instala dependencias
npm run dev     # servidor de desarrollo
npm run build   # build de producción (carpeta dist/)
npm run preview # previsualiza el build
npm run lint    # análisis estático con ESLint
```

## Parte 2 · Chat con IA (Ollama)

Integra un chat con IA consumiendo el servicio local de Ollama.

Requisitos para usar el chat en local:

```bash
# 1. Instalar Ollama: https://ollama.com/download
# 2. Descargar el modelo ligero de DeepSeek R1
ollama pull deepseek-r1:1.5b
# 3. Arrancar el servicio (si no corre como demonio)
ollama serve
```

Variables de entorno opcionales (crear `.env` en `frontend/`):

```bash
VITE_OLLAMA_URL=http://localhost:11434/api/generate
VITE_OLLAMA_MODEL=deepseek-r1:1.5b
```

Piezas principales:

- **`src/hooks/useOllama.js`** — custom hook que consume la API de Ollama con
  `useEffect` (comprueba disponibilidad al montar), maneja los estados de
  carga y error y cancela peticiones con `AbortController`.
- **`src/context/`** — estado global con `useContext` + `useReducer`
  (`chatReducer`, `ChatContext`, `useChat`, `ChatProvider`) para gestionar los
  mensajes y el historial de conversaciones.
- **`src/components/Chat.jsx`** — interfaz de conversación (burbujas, entrada,
  indicador de conexión, guardar/limpiar).
- **`src/components/History.jsx`** — listado de conversaciones previas con
  opción de recuperarlas o eliminarlas.

> Nota: Ollama corre en `localhost`, por lo que el chat solo funciona en el
> entorno local. En GitHub Pages (estático) la interfaz se muestra y notifica
> que el servicio no está disponible; el consumo desde el backend se aborda en
> partes posteriores del proyecto.

## Parte 1 · Formulario de registro

`src/components/RegisterForm.jsx` implementa un formulario con validación
avanzada usando React Hook Form:

- Campos requeridos con mensajes personalizados.
- Validación de longitud (`minLength`, `maxLength`).
- Validación por patrón (correo electrónico).
- Reglas compuestas de contraseña (mayúscula + número) con `validate`.
- Validación cruzada: confirmación de contraseña.
- Aceptación obligatoria de términos.
- Estado de envío asíncrono y mensaje de éxito.

## Despliegue

Se despliega automáticamente en **GitHub Pages** mediante GitHub Actions al
hacer push a la rama `main`. El `base` de Vite está configurado con el nombre
del repositorio para resolver correctamente las rutas de los assets.
