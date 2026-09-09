import express from 'express'

// Crea la aplicación de Express.
const app = express()

// Puerto configurable por variable de entorno (por defecto 3000).
const PORT = process.env.PORT ?? 3000

// Endpoint básico: responde "Hola Mundo" en la raíz.
app.get('/', (req, res) => {
  res.send('Hola Mundo')
})

// Inicia el servidor y queda a la escucha de peticiones.
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`)
})
