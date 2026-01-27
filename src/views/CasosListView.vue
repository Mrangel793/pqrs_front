<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Bandeja de Casos PQR</h1>
        <BaseButton @click="router.push('/casos/nuevo')">
          Nuevo Caso
        </BaseButton>
      </div>

      <!-- Estadísticas Resumen -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <DocumentTextIcon class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-xs text-gray-500">Total</p>
            <p class="text-xl font-bold text-gray-900">{{ estadisticas?.totalCasos || casosStore.total || 0 }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div class="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p class="text-xs text-gray-500">En Proceso</p>
            <p class="text-xl font-bold text-yellow-600">{{ estadisticas?.casosPorEstado?.en_proceso || 0 }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div class="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
            <ExclamationTriangleIcon class="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p class="text-xs text-gray-500">Escalados</p>
            <p class="text-xl font-bold text-red-600">{{ estadisticas?.casosPorEstado?.escalado || 0 }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div class="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-xs text-gray-500">Cerrados</p>
            <p class="text-xl font-bold text-green-600">{{ estadisticas?.casosPorEstado?.cerrado || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <CasoFilters v-model="filters" />

      <!-- Tabla de Casos -->
      <BaseCard>
        <CasoTable
          :casos="casosStore.casos"
          :loading="casosStore.loading"
          @view="handleView"
          @edit="handleEdit"
        />

        <BasePagination
          v-if="casosStore.totalPages > 1"
          :current-page="pagination.page"
          :total-pages="casosStore.totalPages"
          :total="casosStore.total"
          :page-size="pagination.pageSize"
          @previous="handlePrevious"
          @next="handleNext"
          @goto="handleGoToPage"
        />
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import CasoFilters from '@/components/casos/CasoFilters.vue'
import CasoTable from '@/components/casos/CasoTable.vue'
import { useCasosStore } from '@/stores/casos'
import { reportesApi } from '@/api/reportes'
import type { CasoFilters as ICasoFilters, ReporteEstadisticas } from '@/types'

const router = useRouter()
const casosStore = useCasosStore()

const filters = ref<ICasoFilters>({})
const pagination = ref({
  page: 1,
  pageSize: 10
})
const estadisticas = ref<ReporteEstadisticas | null>(null)

async function loadCasos() {
  await casosStore.listar(filters.value, pagination.value)
}

async function loadEstadisticas() {
  try {
    estadisticas.value = await reportesApi.obtenerEstadisticas()
  } catch (error) {
    console.error('Error al cargar estadísticas:', error)
  }
}

watch([filters, pagination], loadCasos, { deep: true })

onMounted(() => {
  loadCasos()
  loadEstadisticas()
})

function handleView(id: number | string) {
  router.push(`/casos/${id}`)
}

function handleEdit(id: number | string) {
  router.push(`/casos/${id}/editar`)
}

function handlePrevious() {
  if (pagination.value.page > 1) {
    pagination.value.page--
  }
}

function handleNext() {
  if (pagination.value.page < casosStore.totalPages) {
    pagination.value.page++
  }
}

function handleGoToPage(page: number) {
  pagination.value.page = page
}
</script>
