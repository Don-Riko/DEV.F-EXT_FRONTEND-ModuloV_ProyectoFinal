# ChatGPDevf

Clon de un chatbot estilo ChatGPT/DeepSeek construido como proyecto final del
Módulo V (Frontend Avanzado) de DEV.F. Integra las cuatro entregas del curso
en un solo sitio: registro/login, dashboard de chat con historial, estado
global con Context API y un backend Express que centraliza el consumo de IA.

- **Frontend** (`frontend/`): React 19 + Vite + Tailwind CSS v4. Se despliega
  en **GitHub Pages**.
- **Backend** (`express/`): API Express con modo dual de IA (Ollama o mock).
  Se despliega en **Vercel**.

El frontend consume el backend mediante la variable `VITE_API_URL`. El backend
intenta responder con el modelo local **Ollama (`deepseek-r1`)** y, si no está
disponible, devuelve una respuesta de demostración (mock) con su control de
error, de modo que el sistema funciona de extremo a extremo en cualquier
entorno.

```
┌────────────────────┐        VITE_API_URL         ┌─────────────────────┐        ┌──────────────────┐
│  Frontend (React)  │ ─────  POST /api/chat  ────▶ │  Backend (Express)  │ ─────▶ │  Ollama local    │
│  GitHub Pages      │ ◀────  { response }    ───── │  Vercel / local     │ ◀───── │  (deepseek-r1)   │
└────────────────────┘                             └─────────────────────┘        └──────────────────┘
                                                       │  sin Ollama → mock
                                                       └──────────────────────────▶ respuesta demo
```

Documentación detallada por capa: [`frontend/README.md`](frontend/README.md) ·
[`express/README.md`](express/README.md).

---

## 1. Ambientación local (backend + frontend)

Cómo levantar el proyecto completo en tu equipo. Con estos pasos el sitio
funciona end-to-end; la IA responderá en modo demostración hasta que
completes la sección 2.

### Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior (recomendado 20/22).
- npm (incluido con Node.js).
- [Git](https://git-scm.com/).

### 1.1 Clonar el repositorio

```bash
git clone https://github.com/Don-Riko/DEV.F-EXT_FRONTEND-ModuloV_ProyectoFinal.git
cd DEV.F-EXT_FRONTEND-ModuloV_ProyectoFinal
```

### 1.2 Levantar el backend

En una **primera terminal**:

```bash
cd express
npm install
npm run dev      # con recarga automática (o: npm start)
```

El backend queda escuchando en **http://localhost:3000**. Verifícalo:

```bash
curl http://localhost:3000/api/health
# -> {"status":"ok","servicio":"chatgpdevf-backend"}
```

### 1.3 Levantar el frontend

En una **segunda terminal**, apuntando el frontend al backend local:

```bash
cd frontend
npm install

# Indica al frontend dónde está el backend (backend local por defecto).
echo "VITE_API_URL=http://localhost:3000" > .env

npm run dev
```

Vite sirve la aplicación en **http://localhost:5173**. Ábrela en el navegador:

1. Crea una cuenta en el formulario de **registro** (o inicia sesión si ya
   creaste una: los usuarios se guardan en `localStorage`).
2. Entrarás al **dashboard del chatbot**. El indicador de estado mostrará
   **"Backend: conectado"**.
3. Escribe un mensaje: la petición viaja al backend. Sin Ollama, la respuesta
   llega en **modo demostración**. Para respuestas reales del modelo, sigue la
   sección 2.

> Nota: el archivo `frontend/.env` está ignorado por git y solo afecta a tu
> entorno local. En producción, GitHub Pages usa la variable `VITE_API_URL`
> definida en el environment del repositorio (apunta al backend en Vercel).

---

## 2. Ambientación del modelo de IA local (Ollama + deepseek-r1)

El backend habla con [Ollama](https://ollama.com/), que ejecuta el modelo de
lenguaje en tu propia máquina. Al completar esta sección, el chat dejará de
responder en modo demostración y devolverá respuestas generadas por el modelo,
integradas de forma transparente desde el frontend.

### 2.1 Instalar Ollama

Descarga el instalador para tu sistema desde
[ollama.com/download](https://ollama.com/download):

- **macOS / Windows**: instalador gráfico (arranca el servicio al abrirlo).
- **Linux**:

  ```bash
  curl -fsSL https://ollama.com/install.sh | sh
  ```

Comprueba la instalación:

```bash
ollama --version
```

### 2.2 Descargar el modelo

Se usa la versión ligera de DeepSeek R1 (~1.1 GB), suficiente para equipos sin
GPU dedicada:

```bash
ollama pull deepseek-r1:1.5b
```

### 2.3 Arrancar el servicio de Ollama

Ollama expone su API REST en **http://localhost:11434**.

```bash
ollama serve
```

> En macOS y Windows, la app de escritorio suele iniciar el servicio
> automáticamente; en ese caso puedes omitir `ollama serve`. Verifica que
> responde:
>
> ```bash
> curl http://localhost:11434
> # -> Ollama is running
> ```

(Opcional) Prueba el modelo directamente:

```bash
ollama run deepseek-r1:1.5b "Hola, ¿quién eres?"
```

### 2.4 Conectar el modelo con el backend

El backend ya está preparado para usar Ollama: por defecto apunta a
`http://localhost:11434/api/generate` con el modelo `deepseek-r1:1.5b`. No hace
falta configurar nada si usas esos valores.

Para personalizarlo, crea `express/.env` (ignorado por git):

```bash
# express/.env (todos los valores son opcionales)
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=deepseek-r1:1.5b
OLLAMA_TIMEOUT=20000          # ms de espera antes de caer al modo demo
```

Con Ollama corriendo, **reinicia el backend** (sección 1.2) para que tome la
conexión.

### 2.5 Verificar la integración completa

Con Ollama, el backend y el frontend en ejecución:

```bash
# Petición directa al backend: la fuente debe ser "ollama"
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Explica qué es React en una línea"}'
# -> {"response":"...","fuente":"ollama"}
```

En el navegador (frontend), el chat mostrará la respuesta generada por el
modelo. El indicador del dashboard pasará a **"IA: Ollama"** en lugar de
**"IA: demo"**.

### 2.6 Solución de problemas

| Síntoma                              | Causa probable / solución                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------------- |
| El chat responde siempre en modo demo| Ollama no está corriendo (`ollama serve`) o el modelo no está descargado (`ollama pull`). |
| `fuente` sigue siendo `mock`         | Reinicia el backend tras arrancar Ollama; revisa `OLLAMA_URL`/`OLLAMA_MODEL`.             |
| Respuestas muy lentas                | El modelo corre en CPU; usa `deepseek-r1:1.5b` o sube `OLLAMA_TIMEOUT`.                    |
| "Backend: sin conexión" en el front  | El backend no está en ejecución o `VITE_API_URL` apunta a una URL incorrecta.             |

> El modelo se ejecuta **solo en local**. El backend desplegado en Vercel no
> puede alojar Ollama (límites del free-tier), por lo que en producción el chat
> responde en modo demostración. Para probar la IA real, ejecuta backend y
> frontend localmente siguiendo las secciones 1 y 2.
