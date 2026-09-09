# ChatGPDevf — Backend (Parte 4)

Servidor básico con **Express** que sienta las bases de la comunicación entre
el front-end y el back-end del proyecto.

## Requisitos

- Node.js 18 o superior.

## Instalación

```bash
cd express
npm install
```

## Ejecución

```bash
npm start      # inicia el servidor (node index.js)
npm run dev    # inicia con recarga automática (node --watch)
```

Por defecto el servidor escucha en `http://localhost:3000`. El puerto puede
cambiarse con la variable de entorno `PORT`.

## Endpoints

| Método | Ruta | Respuesta   |
| ------ | ---- | ----------- |
| GET    | `/`  | `Hola Mundo` |

## Prueba rápida

```bash
curl http://localhost:3000/
# -> Hola Mundo
```
