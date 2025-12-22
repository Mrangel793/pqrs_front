<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="flex items-center justify-between h-16 px-6">
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="text-gray-500 hover:text-gray-700"
          @click="uiStore.toggleSidebar()"
        >
          <Bars3Icon class="h-6 w-6" />
        </button>
        <h1 class="text-xl font-semibold text-gray-900">
          {{ appName }}
        </h1>
      </div>

      <div class="flex items-center gap-4">
        <button
          type="button"
          class="relative p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <BellIcon class="h-6 w-6" />
          <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <Menu as="div" class="relative">
          <MenuButton class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
            <div class="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {{ userInitials }}
            </div>
            <ChevronDownIcon class="h-4 w-4 text-gray-500" />
          </MenuButton>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">{{ authStore.usuario?.nombre }}</p>
                <p class="text-xs text-gray-500">{{ authStore.usuario?.email }}</p>
              </div>
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <router-link
                    to="/perfil"
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700'
                    ]"
                  >
                    Mi Perfil
                  </router-link>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <button
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block w-full text-left px-4 py-2 text-sm text-red-700'
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
import { Bars3Icon, BellIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()

const appName = import.meta.env.VITE_APP_NAME || 'Sistema PQR'

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
