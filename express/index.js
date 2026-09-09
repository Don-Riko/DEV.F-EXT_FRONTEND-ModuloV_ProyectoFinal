import { app } from './app.js'

// Puerto configurable por variable de entorno (por defecto 3000).
const PORT = process.env.PORT ?? 3000

// Arranque local: pone el servidor a la escucha. En Vercel no se usa este
// archivo, sino la función serverless de api/index.js.
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`)
})
