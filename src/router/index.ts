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
      redirect: '/casos'
    },
    {
      path: '/dashboard',
      redirect: '/casos'
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
    // Si hay token pero no hay usuario (caso refresh), intentar cargar perfil
    if (authStore.token && !authStore.usuario) {
      await authStore.fetchProfile()
    }

    if (!authStore.isAuthenticated) {
      return next('/login')
    }

    // Verificar si requiere rol de admin
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      return next('/casos')
    }
  }

  // Si el usuario está autenticado y trata de ir al login, redirigir a casos
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/casos')
  }

  next()
})

export default router
