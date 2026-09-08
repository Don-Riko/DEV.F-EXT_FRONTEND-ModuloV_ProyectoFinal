import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// El "base" debe coincidir con el nombre del repositorio para que
// GitHub Pages resuelva correctamente las rutas de los assets.
// https://<usuario>.github.io/DEV.F-EXT_FRONTEND-ModuloV_ProyectoFinal/
export default defineConfig({
  base: '/DEV.F-EXT_FRONTEND-ModuloV_ProyectoFinal/',
  plugins: [react(), tailwindcss()],
})
