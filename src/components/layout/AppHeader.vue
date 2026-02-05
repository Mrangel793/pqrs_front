<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="flex items-center justify-between h-20 px-8">
      <!-- Logo/Brand -->
      <div class="flex items-center gap-3">
        <div class="h-6 w-6 flex items-center justify-center">
          <svg viewBox="0 0 24 24" class="h-5 w-5 fill-gray-900">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-900 tracking-tight">
          PQR System
        </h1>
      </div>

      <!-- Navigation Menu -->
      <nav class="hidden md:flex items-center gap-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          v-slot="{ isActive }"
        >
          <div
            :class="[
              'px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200',
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            {{ item.label }}
          </div>
        </router-link>
      </nav>

      <!-- Right Actions: Notifications & User Profile -->
      <div class="flex items-center gap-6">
        <AlertaBadge />

        <Menu as="div" class="relative">
          <MenuButton class="group flex items-center">
            <div class="h-10 w-10 rounded-full border-2 border-transparent group-hover:border-blue-100 transition-all overflow-hidden bg-gray-100 flex items-center justify-center">
              <span v-if="!authStore.usuario?.avatar" class="text-sm font-bold text-blue-600">
                {{ userInitials }}
              </span>
              <img v-else :src="authStore.usuario.avatar" alt="Avatar" class="h-full w-full object-cover" />
            </div>
          </MenuButton>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems class="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
              <div class="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                <p class="text-sm font-bold text-gray-900">{{ authStore.usuario?.nombre }}</p>
                <p class="text-xs text-gray-500 truncate">{{ authStore.usuario?.email }}</p>
              </div>
              <div class="py-2">
                <MenuItem v-slot="{ active }">
                  <router-link
                    to="/perfil"
                    :class="[
                      active ? 'bg-blue-50 text-blue-700' : 'text-gray-700',
                      'block px-5 py-2.5 text-sm font-medium'
                    ]"
                  >
                    Mi Perfil
                  </router-link>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-red-50 text-red-700' : 'text-red-600',
                      'block w-full text-left px-5 py-2.5 text-sm font-medium'
                    ]"
                    @click="handleLogout"
                  >
                    Cerrar Sesión
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useAuthStore } from '@/stores/auth'
import AlertaBadge from '@/components/alertas/AlertaBadge.vue'

const router = useRouter()
const authStore = useAuthStore()

const appName = import.meta.env.VITE_APP_NAME || 'Sistema PQR'

const menuItems = computed(() => {
  const items = [
    { path: '/casos', label: 'Casos' },
    { path: '/alertas', label: 'Alertas' },
    { path: '/reportes', label: 'Reportes' }
  ]

  if (authStore.isAdmin) {
    items.push({ path: '/configuracion', label: 'Configuración' })
  }

  return items
})

const userInitials = computed(() => {
  if (!authStore.usuario) return '??'
  const names = authStore.usuario.nombre.split(' ')
  return names.map((n) => n[0]).join('').toUpperCase().slice(0, 2)
})

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>
