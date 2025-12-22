<template>
  <aside
    :class="[
      'bg-white border-r border-gray-200 transition-all duration-300',
      uiStore.sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
    ]"
  >
    <nav class="p-4 space-y-1">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        v-slot="{ isActive }"
      >
        <div
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
            isActive
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
        >
          <component :is="item.icon" class="h-5 w-5" />
          <span class="font-medium text-sm">{{ item.label }}</span>
        </div>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'

const authStore = useAuthStore()
const uiStore = useUIStore()

interface MenuItem {
  path: string
  label: string
  icon: any
  adminOnly?: boolean
}

const allMenuItems: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/casos', label: 'Casos PQR', icon: DocumentTextIcon },
  { path: '/reportes', label: 'Reportes', icon: ChartBarIcon },
  { path: '/usuarios', label: 'Usuarios', icon: UsersIcon, adminOnly: true },
  { path: '/auditoria', label: 'Auditoría', icon: ClipboardDocumentListIcon, adminOnly: true },
  { path: '/configuracion', label: 'Configuración', icon: Cog6ToothIcon, adminOnly: true }
]

const menuItems = computed(() => {
  if (authStore.isAdmin) {
    return allMenuItems
  }
  return allMenuItems.filter((item) => !item.adminOnly)
})
</script>
