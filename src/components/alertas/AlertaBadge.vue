<template>
  <router-link
    to="/alertas"
    class="relative p-2.5 bg-blue-50/50 text-gray-700 hover:text-blue-600 rounded-full transition-colors"
  >
    <BellIcon class="h-6 w-6" />

    <!-- Badge de vencidos (rojo) -->
    <span
      v-if="alertasStore.tieneCasosVencidos"
      class="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs font-bold text-white rounded-full"
      :style="{ backgroundColor: '#DC3545' }"
    >
      {{ formatCount(alertasStore.bandeja?.casos_vencidos || 0) }}
    </span>

    <!-- Badge de por vencer (amarillo) - solo si no hay vencidos -->
    <span
      v-else-if="alertasStore.tieneCasosPorVencer"
      class="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-xs font-bold text-gray-900 rounded-full"
      :style="{ backgroundColor: '#FFC107' }"
    >
      {{ formatCount(alertasStore.bandeja?.casos_por_vencer || 0) }}
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { BellIcon } from '@heroicons/vue/24/outline'
import { useAlertasStore } from '@/stores/alertas'

const alertasStore = useAlertasStore()

function formatCount(count: number): string {
  return count > 99 ? '99+' : String(count)
}

onMounted(() => {
  alertasStore.cargarBandeja()
  alertasStore.iniciarAutoRefresh(60000)
})

onUnmounted(() => {
  alertasStore.detenerAutoRefresh()
})
</script>
