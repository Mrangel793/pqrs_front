# Sistema PQR - Frontend

Sistema de gestión de casos PQR (Peticiones, Quejas y Reclamos) escalados construido con Vue 3, TypeScript y Tailwind CSS.

## Tecnologías

- **Vue 3** - Framework progresivo de JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Vite** - Build tool y dev server
- **Pinia** - State management
- **Vue Router** - Enrutamiento
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP
- **Headless UI** - Componentes UI accesibles
- **Heroicons** - Iconos SVG
- **Date-fns** - Librería de utilidades de fechas
- **Vue Toastification** - Notificaciones toast

## Estructura del Proyecto

```
src/
├── api/                    # Módulos de API (axios, auth, casos, etc.)
├── components/
│   ├── common/            # Componentes base reutilizables
│   ├── layout/            # Componentes de layout (Header, Sidebar)
│   └── casos/             # Componentes específicos de casos
├── composables/           # Composables de Vue (useToast, usePagination, etc.)
├── router/                # Configuración de rutas
├── stores/                # Stores de Pinia (auth, casos, usuarios, ui)
├── types/                 # Definiciones de tipos TypeScript
├── utils/                 # Utilidades y helpers
├── views/                 # Vistas/Páginas de la aplicación
└── main.ts               # Punto de entrada de la aplicación
```

## Instalación

```sh
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

Editar `.env` con la URL de tu API backend:

```
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Sistema PQR Escaladas
```

## Desarrollo

```sh
# Servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build para Producción

```sh
npm run build
```

Los archivos compilados estarán en el directorio `dist/`

## Linting

```sh
npm run lint
```

## Características Principales

### Autenticación
- Login con email y contraseña
- Guards de navegación basados en roles
- Gestión de sesión con JWT

### Gestión de Casos
- Listado de casos con filtros avanzados
- Vista detallada de casos
- Sistema de semáforo (verde, amarillo, rojo)
- Asignación de casos a agentes
- Cambio de estado y prioridad
- Escalamiento de casos
- Historial de eventos

### Dashboard
- Estadísticas en tiempo real
- Distribución por tipo, estado y semáforo
- Métricas de rendimiento

### Componentes Base

- BaseButton, BaseInput, BaseSelect
- BaseModal, BaseCard, BaseBadge
- BaseTable, BasePagination
- BaseLoading, BaseEmptyState

## Rutas Principales

- `/login` - Página de inicio de sesión
- `/dashboard` - Dashboard principal
- `/casos` - Listado de casos
- `/casos/:id` - Detalle de caso
- `/perfil` - Perfil de usuario
- `/reportes` - Reportes
- `/usuarios` - Gestión de usuarios (admin)
- `/auditoria` - Auditoría (admin)
- `/configuracion` - Configuración (admin)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default. We use `vue-tsc` for type checking and need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) for `.vue` type support.
