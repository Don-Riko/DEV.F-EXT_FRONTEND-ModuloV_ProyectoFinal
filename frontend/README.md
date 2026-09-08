# DevfSeek — Frontend (Parte 1)

Aplicación React + Vite con **Tailwind CSS v4** y **React Hook Form** para
validación avanzada de formularios. Primera entrega del proyecto final del
Módulo V (Frontend Avanzado) de DEV.F.

## Stack

- [React 19](https://react.dev/)
- [Vite 7](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (plugin oficial de Vite)
- [React Hook Form](https://react-hook-form.com/)

## Scripts

```bash
npm install     # instala dependencias
npm run dev     # servidor de desarrollo
npm run build   # build de producción (carpeta dist/)
npm run preview # previsualiza el build
npm run lint    # análisis estático con ESLint
```

## Formulario de registro

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
