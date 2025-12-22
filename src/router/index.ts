import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/casos',
      name: 'casos',
      component: () => import('@/views/CasosListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/casos/:id',
      name: 'caso-detalle',
      component: () => import('@/views/CasoDetalleView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/views/PerfilView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: () => import('@/views/ReportesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('@/views/ConfiguracionView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/auditoria',
      name: 'auditoria',
      component: () => import('@/views/AuditoriaView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: () => import('@/views/ConfiguracionView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next('/login')
    }

    // Si no tenemos el usuario cargado, intentar obtenerlo
    if (!authStore.usuario) {
      await authStore.fetchProfile()
    }

    // Verificar si requiere rol de admin
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      return next('/dashboard')
    }
  }

  // Si el usuario está autenticado y trata de ir al login, redirigir al dashboard
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/dashboard')
  }

  next()
})

export default router
