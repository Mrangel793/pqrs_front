<template>
  <AppLayout>
    <div class="max-w-7xl mx-auto space-y-10 py-4">
      <!-- Header & Filters -->
      <section class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Reportes</h1>
          <p class="text-gray-500 mt-1">Genera informes detallados sobre la gestión de PQR.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <BaseInput
            v-model="filters.fechaDesde"
            type="date"
            label="Fecha de inicio"
            placeholder="Seleccionar fecha"
          />
          <BaseInput
            v-model="filters.fechaHasta"
            type="date"
            label="Fecha de fin"
            placeholder="Seleccionar fecha"
          />
          <div>
            <BaseButton block @click="cargarReportes" :loading="loading">
              Consultar
            </BaseButton>
          </div>
        </div>
      </section>

      <!-- Summary Stats -->
      <section class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="stat in summaryStats" :key="stat.label" class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <span class="text-sm font-medium text-gray-500">{{ stat.label }}</span>
          <div class="flex items-baseline gap-3">
            <span class="text-3xl font-bold text-gray-900">{{ stat.value }}</span>
            <span v-if="stat.trend" :class="['text-sm font-bold', stat.trend > 0 ? 'text-green-500' : 'text-red-500']">
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
          </div>
        </div>
      </section>

      <!-- Detailed Tables -->
      <section class="space-y-8">
        <!-- Responsable Table -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 class="font-bold text-gray-900">Tabla Casos por Responsable</h2>
          </div>
          <BaseTable :columns="responsableColumns" :data="reporteResponsables" :loading="loading">
            <template #cell-asignados="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}</span>
            </template>
            <template #cell-respondidos="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}</span>
            </template>
            <template #cell-pendientes="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}</span>
            </template>
            <template #cell-aTiempo="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}</span>
            </template>
            <template #cell-fueraTiempo="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}</span>
            </template>
            <template #cell-cumplimiento="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}%</span>
            </template>
          </BaseTable>
        </div>

        <!-- Estado Table -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 class="font-bold text-gray-900">Tabla Casos por Estado</h2>
          </div>
          <BaseTable :columns="estadoColumns" :data="reporteEstados" :loading="loading">
            <template #cell-cantidad="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}</span>
            </template>
            <template #cell-porcentaje="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}%</span>
            </template>
          </BaseTable>
        </div>

        <!-- Tipo Table -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 class="font-bold text-gray-900">Tabla Casos por Tipo de Trámite</h2>
          </div>
          <BaseTable :columns="tipoColumns" :data="reporteTipos" :loading="loading">
            <template #cell-total="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}</span>
            </template>
            <template #cell-respondidos="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}</span>
            </template>
            <template #cell-pendientes="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}</span>
            </template>
            <template #cell-completado="{ value }">
              <span class="text-blue-600 font-medium">{{ value }}%</span>
            </template>
          </BaseTable>
        </div>
      </section>

      <!-- Footer Actions -->
      <footer class="flex justify-end gap-4 pt-4">
        <BaseButton variant="secondary" @click="exportExcel">
          Exportar Excel
        </BaseButton>
        <BaseButton @click="exportPDF">
          Exportar PDF
        </BaseButton>
      </footer>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import { reportesApi } from '@/api/reportes'

const loading = ref(false)
const filters = ref({
  fechaDesde: '',
  fechaHasta: ''
})

// Summary Metrics
const summaryStats = ref([
  { label: 'Total casos en el periodo', value: '1234', trend: null },
  { label: 'Respondidos a tiempo', value: '1100', trend: 89 },
  { label: 'Respondidos fuera de tiempo', value: '134', trend: -11 },
  { label: 'Tiempo promedio de respuesta', value: '3 dias', trend: null }
])

// Table Columns Definitions
const responsableColumns = [
  { key: 'responsable', label: 'Responsable' },
  { key: 'asignados', label: 'Asignados' },
  { key: 'respondidos', label: 'Respondidos' },
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'aTiempo', label: 'A Tiempo' },
  { key: 'fueraTiempo', label: 'Fuera de tiempo' },
  { key: 'cumplimiento', label: '% Cumplimiento' }
]

const estadoColumns = [
  { key: 'estado', label: 'Estado' },
  { key: 'cantidad', label: 'Cantidad' },
  { key: 'porcentaje', label: 'Porcentaje' }
]

const tipoColumns = [
  { key: 'tipo', label: 'Tipo de Trámite' },
  { key: 'total', label: 'Total' },
  { key: 'respondidos', label: 'Respondidos' },
  { key: 'pendientes', label: 'Pendientes' },
  { key: 'completado', label: '% Completado' }
]

// Mock Data (Real structure for API integration)
const reporteResponsables = ref([
  { responsable: 'Ing. Sofia Ramirez', asignados: 250, respondidos: 230, pendientes: 20, aTiempo: 220, fueraTiempo: 10, cumplimiento: 92 },
  { responsable: 'Ing. Alejandro Vargas', asignados: 200, respondidos: 180, pendientes: 20, aTiempo: 170, fueraTiempo: 10, cumplimiento: 85 },
  { responsable: 'Ing. Camila Torres', asignados: 180, respondidos: 150, pendientes: 30, aTiempo: 120, fueraTiempo: 30, cumplimiento: 67 },
  { responsable: 'Ing. Diego Rodriguez', asignados: 220, respondidos: 200, pendientes: 20, aTiempo: 190, fueraTiempo: 10, cumplimiento: 86 },
  { responsable: 'Ing. Isabela Castro', asignados: 150, respondidos: 130, pendientes: 20, aTiempo: 120, fueraTiempo: 10, cumplimiento: 80 },
  { responsable: 'Total', asignados: 1000, respondidos: 890, pendientes: 110, aTiempo: 820, fueraTiempo: 70, cumplimiento: 82 }
])

const reporteEstados = ref([
  { estado: 'NUEVO', cantidad: 100, porcentaje: 10 },
  { estado: 'EN_GESTION', cantidad: 300, porcentaje: 30 },
  { estado: 'ESCALADO', cantidad: 200, porcentaje: 20 },
  { estado: 'RESUELTO', cantidad: 350, porcentaje: 35 },
  { estado: 'CERRADO', cantidad: 50, porcentaje: 5 }
])

const reporteTipos = ref([
  { tipo: 'Solicitud', total: 400, respondidos: 350, pendientes: 50, completado: 88 },
  { tipo: 'Queja', total: 300, respondidos: 250, pendientes: 50, completado: 83 },
  { tipo: 'Reclamo', total: 200, respondidos: 180, pendientes: 20, completado: 90 },
  { tipo: 'Sugerencia', total: 100, respondidos: 90, pendientes: 10, completado: 90 }
])

async function cargarReportes() {
  loading.value = true
  try {
    // Here we would call reportesApi.obtenerEstadisticas(filters.value)
    // For now we keep the data structure ready
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('Filtros aplicados:', filters.value)
  } catch (err) {
    console.error('Error cargando reportes:', err)
  } finally {
    loading.value = false
  }
}

async function exportExcel() {
  try {
    const blob = await reportesApi.exportarExcel(filters.value)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte_pqr_${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
  } catch (err) {
    console.error('Error exportando Excel:', err)
  }
}

async function exportPDF() {
  console.log('Exporting PDF...')
  // Placeholder for PDF export
}

onMounted(() => {
  // Optional: trigger initial load
  // cargarReportes()
})
</script>
