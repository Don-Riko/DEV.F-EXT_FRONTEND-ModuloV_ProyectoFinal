// Punto de entrada para el entorno serverless de Vercel.
// Vercel invoca la app de Express como una función (sin app.listen).
import { app } from '../app.js'

export default app
