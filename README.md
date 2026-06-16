# Food Store — Storefront (Cliente)

Tienda online del cliente: catálogo de productos, carrito persistente, checkout con
**MercadoPago** y seguimiento de pedidos en **tiempo real** vía WebSocket.

Es el frontend público del sistema Food Store (requiere el **backend** corriendo):

| Repo | Rol | Puerto |
| :--- | :--- | :--- |
| integrador2 | Backend FastAPI | `8000` |
| **Repo-Store** (este) | Storefront del cliente | `5173` |
| Repo-Admin | Panel de administración | `5174` |

## Stack

- **React 19** + **TypeScript** + **Vite**
- **TanStack Query** (estado del servidor) · **Zustand** (carrito + sesión)
- **React Router** · **Axios** (cookies httpOnly, refresh 401 automático) · **Tailwind CSS v4**
- Arquitectura **Feature-Sliced**: `src/modules/<feature>/{types,services,hooks,components,pages}`

## Requisitos

- **Node.js 20+**
- **pnpm** (recomendado) — `npm i -g pnpm`
- El **backend** corriendo en `http://localhost:8000` (ver el repo `integrador2`).

## Cómo levantarlo

```bash
# 1) Dependencias
pnpm install

# 2) Variables de entorno
cp .env.example .env
#   por defecto apunta a http://localhost:8000/api/v1 — ajustar si el backend está en otro host

# 3) Dev server
pnpm dev
```

- App: <http://localhost:5173>

Otros scripts: `pnpm build` (typecheck + build de producción) · `pnpm preview` · `pnpm lint`.

> Si preferís npm, también funciona: `npm install` + `npm run dev`.

## Variables de entorno

| Variable | Descripción | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base de la API. **Debe incluir** `/api/v1`. | `http://localhost:8000/api/v1` |

## Estructura

```
src/
├── shared/                 # api (axios + interceptors), types, constants, ui
└── modules/
    ├── auth/               # login, registro, perfil (auth.store.ts)
    ├── home/               # catálogo y detalle de producto
    ├── cart/               # carrito persistente (cart.store.ts)
    ├── checkout/           # crear pedido + redirect a MercadoPago
    └── orders/             # mis pedidos + tracking WS (useOrderSocket)
```

## Notas

- La sesión se maneja con **cookies httpOnly**: el front nunca guarda el token en
  `localStorage`. Por eso Axios usa `withCredentials: true`.
- El checkout con MercadoPago usa **Checkout PRO (redirect)**: el backend devuelve el
  `init_point` y el navegador redirige a la pasarela.

## Entrega

- Carpeta del proyecto (Drive): <https://drive.google.com/drive/u/0/folders/1rD6m_CmaMqE0NhEshcEeYeRTF7zvpcle>
- 🎥 Video demo (10–15 min): _pendiente de subir — pegar el link acá_
