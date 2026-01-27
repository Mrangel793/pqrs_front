import { ref } from 'vue'
import { defineStore } from 'pinia'
import { casosApi } from '@/api/casos'
import type { Caso, CasoFormData, CasoFilters, PaginationParams } from '@/types'

export const useCasosStore = defineStore('casos', () => {
  const casos = ref<Caso[]>([])
  const casoActual = ref<Caso | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Paginación
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(0)

  async function listar(filters?: CasoFilters, pagination?: PaginationParams) {
    try {
      loading.value = true
      error.value = null
      const response = await casosApi.listar(filters, pagination)
      casos.value = response.data
      total.value = response.total
      page.value = response.page
      pageSize.value = response.pageSize
      totalPages.value = response.totalPages
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar casos'
    } finally {
      loading.value = false
    }
  }

  async function obtener(id: number | string) {
    try {
      loading.value = true
      error.value = null
      casoActual.value = await casosApi.obtener(id)
      return casoActual.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar caso'
      return null
    } finally {
      loading.value = false
    }
  }

  async function crear(casoData: CasoFormData) {
    try {
      loading.value = true
      error.value = null
      const nuevoCaso = await casosApi.crear(casoData)
      casos.value.unshift(nuevoCaso)
      return nuevoCaso
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear caso'
      return null
    } finally {
      loading.value = false
    }
  }

  async function actualizar(id: number, updates: Partial<CasoFormData>) {
    try {
      loading.value = true
      error.value = null
      const casoActualizado = await casosApi.actualizar(id, updates)

      // Actualizar en la lista
      const index = casos.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        casos.value[index] = casoActualizado
      }

      // Actualizar caso actual si es el mismo
      if (casoActual.value?.id === id) {
        casoActual.value = casoActualizado
      }

      return casoActualizado
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar caso'
      return null
    } finally {
      loading.value = false
    }
  }

  async function eliminar(id: number) {
    try {
      loading.value = true
      error.value = null
      await casosApi.eliminar(id)
      casos.value = casos.value.filter((c) => c.id !== id)
      if (casoActual.value?.id === id) {
        casoActual.value = null
      }
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar caso'
      return false
    } finally {
      loading.value = false
    }
  }

  async function asignar(id: number, agenteId: number) {
    try {
      loading.value = true
      error.value = null
      const casoActualizado = await casosApi.asignar(id, agenteId)

      const index = casos.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        casos.value[index] = casoActualizado
      }

      if (casoActual.value?.id === id) {
        casoActual.value = casoActualizado
      }

      return casoActualizado
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al asignar caso'
      return null
    } finally {
      loading.value = false
    }
  }

  async function cambiarEstado(id: number, estado: string) {
    try {
      loading.value = true
      error.value = null
      const casoActualizado = await casosApi.cambiarEstado(id, estado)

      const index = casos.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        casos.value[index] = casoActualizado
      }

      if (casoActual.value?.id === id) {
        casoActual.value = casoActualizado
      }

      return casoActualizado
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cambiar estado'
      return null
    } finally {
      loading.value = false
    }
  }

  async function cambiarPrioridad(id: number, prioridad: string) {
    try {
      loading.value = true
      error.value = null
      const casoActualizado = await casosApi.cambiarPrioridad(id, prioridad)

      const index = casos.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        casos.value[index] = casoActualizado
      }

      if (casoActual.value?.id === id) {
        casoActual.value = casoActualizado
      }

      return casoActualizado
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cambiar prioridad'
      return null
    } finally {
      loading.value = false
    }
  }

  function limpiarCasoActual() {
    casoActual.value = null
  }

  return {
    casos,
    casoActual,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    listar,
    obtener,
    crear,
    actualizar,
    eliminar,
    asignar,
    cambiarEstado,
    cambiarPrioridad,
    limpiarCasoActual
  }
})
