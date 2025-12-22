<template>
  <AppLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BaseCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Total Casos</p>
              <p class="text-3xl font-bold text-gray-900">{{ estadisticas?.totalCasos || 0 }}</p>
            </div>
            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon class="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">En Proceso</p>
              <p class="text-3xl font-bold text-yellow-600">
                {{ estadisticas?.casosPorEstado?.en_proceso || 0 }}
              </p>
            </div>
            <div class="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Escalados</p>
              <p class="text-3xl font-bold text-red-600">
                {{ estadisticas?.casosPorEstado?.escalado || 0 }}
              </p>
            </div>
            <div class="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon class="h-6 w-6 text-red-600" />
            </div>
          </div>
        </BaseCard>

        <BaseCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Cerrados</p>
              <p class="text-3xl font-bold text-green-600">
                {{ estadisticas?.casosPorEstado?.cerrado || 0 }}
              </p>
            </div>
            <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard title="Distribución por Semáforo">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-3 w-3 bg-green-500 rounded-full"></div>
                <span class="text-sm text-gray-700">Verde (A tiempo)</span>
              </div>
              <span class="text-sm font-medium">{{ estadisticas?.casosPorSemaforo?.verde || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <span class="text-sm text-gray-700">Amarillo (Por vencer)</span>
              </div>
              <span class="text-sm font-medium">{{ estadisticas?.casosPorSemaforo?.amarillo || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-3 w-3 bg-red-500 rounded-full"></div>
                <span class="text-sm text-gray-700">Rojo (Vencido)</span>
              </div>
              <span class="text-sm font-medium">{{ estadisticas?.casosPorSemaforo?.rojo || 0 }}</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard title="Distribución por Tipo">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Peticiones</span>
              <span class="text-sm font-medium">{{ estadisticas?.casosPorTipo?.peticion || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Quejas</span>
              <span class="text-sm font-medium">{{ estadisticas?.casosPorTipo?.queja || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Reclamos</span>
              <span class="text-sm font-medium">{{ estadisticas?.casosPorTipo?.reclamo || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">Sugerencias</span>
              <span class="text-sm font-medium">{{ estadisticas?.casosPorTipo?.sugerencia || 0 }}</span>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import { reportesApi } from '@/api/reportes'
import type { ReporteEstadisticas } from '@/types'

const estadisticas = ref<ReporteEstadisticas | null>(null)

onMounted(async () => {
  try {
    estadisticas.value = await reportesApi.obtenerEstadisticas()
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }
})
</script>
