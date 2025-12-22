import apiClient from './axios'
import type { ReporteEstadisticas, ReporteTendencias } from '@/types'

export interface ReporteFilters {
  fechaDesde?: string
  fechaHasta?: string
  tipo?: string
  categoria?: string
  agenteId?: number
}

export const reportesApi = {
  async obtenerEstadisticas(filters?: ReporteFilters): Promise<ReporteEstadisticas> {
    const { data } = await apiClient.get<ReporteEstadisticas>('/reportes/estadisticas', {
      params: filters
    })
    return data
  },

  async obtenerTendencias(
    periodo: 'dia' | 'semana' | 'mes',
    filters?: ReporteFilters
  ): Promise<ReporteTendencias[]> {
    const { data } = await apiClient.get<ReporteTendencias[]>('/reportes/tendencias', {
      params: { periodo, ...filters }
    })
    return data
  },

  async exportarExcel(filters?: ReporteFilters): Promise<Blob> {
    const { data } = await apiClient.post(
      '/reportes/exportar/excel',
      filters,
      {
        responseType: 'blob'
      }
    )
    return data
  },

  async exportarCSV(filters?: ReporteFilters): Promise<Blob> {
    const { data } = await apiClient.post(
      '/reportes/exportar/csv',
      filters,
      {
        responseType: 'blob'
      }
    )
    return data
  }
}
