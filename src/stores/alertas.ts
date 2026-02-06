import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { alertasApi } from '@/api/alertas'
import type { AlertaBandeja, AlertaCasoItem, PaginationParams } from '@/types'

export const useAlertasStore = defineStore('alertas', () => {
  // Estado
  const bandeja = ref<AlertaBandeja | null>(null)
  const casosVencidos = ref<AlertaCasoItem[]>([])
  const casosPorVencer = ref<AlertaCasoItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Paginación para vencidos
  const totalVencidos = ref(0)
  const pageVencidos = ref(1)
  const pageSizeVencidos = ref(10)

  // Paginación para por vencer
  const totalPorVencer = ref(0)
  const pagePorVencer = ref(1)
  const pageSizePorVencer = ref(10)

  // Filtro mis casos
  const soloMisCasos = ref(false)

  // Auto-refresh
  let refreshInterval: ReturnType<typeof setInterval> | null = null

  // Computed
  const totalPagesVencidos = computed(() =>
    Math.ceil(totalVencidos.value / pageSizeVencidos.value)
  )

  const totalPagesPorVencer = computed(() =>
    Math.ceil(totalPorVencer.value / pageSizePorVencer.value)
  )

  const tieneCasosVencidos = computed(() =>
    (bandeja.value?.casos_vencidos ?? 0) > 0
  )

  const tieneCasosPorVencer = computed(() =>
    (bandeja.value?.casos_por_vencer ?? 0) > 0
  )

  // Acciones
  async function cargarBandeja() {
    try {
      error.value = null
      bandeja.value = await alertasApi.obtenerBandeja(soloMisCasos.value)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar bandeja de alertas'
      console.error('Error cargando bandeja:', err)
    }
  }

  async function cargarVencidos(pagination?: PaginationParams) {
    try {
      loading.value = true
      error.value = null

      const paginacion = pagination || {
        page: pageVencidos.value,
        pageSize: pageSizeVencidos.value
      }

      const response = await alertasApi.listarVencidos(paginacion, soloMisCasos.value)
      casosVencidos.value = response.items
      totalVencidos.value = response.total

      if (pagination) {
        pageVencidos.value = pagination.page
        pageSizeVencidos.value = pagination.pageSize
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar casos vencidos'
      console.error('Error cargando vencidos:', err)
    } finally {
      loading.value = false
    }
  }

  async function cargarPorVencer(pagination?: PaginationParams) {
    try {
      loading.value = true
      error.value = null

      const paginacion = pagination || {
        page: pagePorVencer.value,
        pageSize: pageSizePorVencer.value
      }

      const response = await alertasApi.listarPorVencer(paginacion, soloMisCasos.value)
      casosPorVencer.value = response.items
      totalPorVencer.value = response.total

      if (pagination) {
        pagePorVencer.value = pagination.page
        pageSizePorVencer.value = pagination.pageSize
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar casos por vencer'
      console.error('Error cargando por vencer:', err)
    } finally {
      loading.value = false
    }
  }

  async function cargarTodo() {
    await Promise.all([
      cargarBandeja(),
      cargarVencidos(),
      cargarPorVencer()
    ])
  }

  function toggleMisCasos(valor: boolean) {
    soloMisCasos.value = valor
    pageVencidos.value = 1
    pagePorVencer.value = 1
  }

  function iniciarAutoRefresh(intervaloMs = 60000) {
    detenerAutoRefresh()
    refreshInterval = setInterval(() => {
      cargarBandeja()
    }, intervaloMs)
  }

  function detenerAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  function resetPaginacionVencidos() {
    pageVencidos.value = 1
  }

  function resetPaginacionPorVencer() {
    pagePorVencer.value = 1
  }

  return {
    // Estado
    bandeja,
    casosVencidos,
    casosPorVencer,
    loading,
    error,
    soloMisCasos,

    // Paginación vencidos
    totalVencidos,
    pageVencidos,
    pageSizeVencidos,
    totalPagesVencidos,

    // Paginación por vencer
    totalPorVencer,
    pagePorVencer,
    pageSizePorVencer,
    totalPagesPorVencer,

    // Computed
    tieneCasosVencidos,
    tieneCasosPorVencer,

    // Acciones
    cargarBandeja,
    cargarVencidos,
    cargarPorVencer,
    cargarTodo,
    toggleMisCasos,
    iniciarAutoRefresh,
    detenerAutoRefresh,
    resetPaginacionVencidos,
    resetPaginacionPorVencer
  }
})
