# ChatGPDevf — Backend (Express)

API con **Express** que centraliza las peticiones de IA del frontend. Funciona
en dos entornos:

- **Local**: `index.js` arranca el servidor con `app.listen`.
- **Vercel (serverless)**: `api/index.js` exporta la app como función.

## Modo dual de IA

El endpoint de chat intenta primero responder con **Ollama** (modelo
`deepseek-r1`). Si Ollama no está disponible —por ejemplo, en el free-tier de
Vercel, que no puede alojar el modelo— responde con un **modo de demostración
(mock)** para que la interacción siga funcionando de extremo a extremo.

## Requisitos

- Node.js 18 o superior.

## Instalación y ejecución local

```bash
cd express
npm install
npm start      # http://localhost:3000
npm run dev    # con recarga automática
```

Para respuestas reales del modelo, ejecuta Ollama en local:

```bash
ollama pull deepseek-r1:1.5b
ollama serve
```

## Variables de entorno

| Variable        | Por defecto                             | Descripción                                  |
| --------------- | --------------------------------------- | -------------------------------------------- |
| `PORT`          | `3000`                                  | Puerto local.                                |
| `OLLAMA_URL`    | `http://localhost:11434/api/generate`   | Endpoint de generación de Ollama.            |
| `OLLAMA_MODEL`  | `deepseek-r1:1.5b`                       | Modelo a usar.                               |
| `OLLAMA_TIMEOUT`| `20000`                                 | Tiempo máximo (ms) antes de pasar al mock.   |

> CORS: la API es pública y refleja el origen de la petición en la cabecera
> `Access-Control-Allow-Origin`, por lo que **no requiere configuración**.

## Endpoints

| Método | Ruta          | Cuerpo             | Respuesta                                  |
| ------ | ------------- | ------------------ | ------------------------------------------ |
| GET    | `/`           | —                  | `Hola Mundo`                               |
| GET    | `/api/health` | —                  | `{ "status": "ok", ... }`                  |
| POST   | `/api/chat`   | `{ "prompt": "…" }`| `{ "response": "…", "fuente": "ollama\|mock" }` |

### Prueba rápida

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hola"}'
```

## Despliegue en Vercel (free tier)

El backend está preparado para Vercel mediante `vercel.json` y la función
`api/index.js`.

1. Importa el repositorio en Vercel.
2. En **Root Directory**, selecciona `express/`.
3. Despliega. La URL pública resultante se usa en el frontend a través de
   `VITE_API_URL`.

> Nota: Vercel no puede alojar Ollama ni el modelo (límites de tamaño y tiempo
> del free-tier), por lo que en producción el chat responde en modo
> demostración. El consumo real del modelo ocurre al ejecutar el backend en
> local con Ollama.
