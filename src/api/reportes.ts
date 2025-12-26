import apiClient from './axios'
import type { ReporteEstadisticas, ReporteTendencias } from '@/types'
import { mockReportesApi } from './reportes.mock'

export interface ReporteFilters {
  fechaDesde?: string
  fechaHasta?: string
  tipo?: string
  categoria?: string
  agenteId?: number
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const api = USE_MOCK ? mockReportesApi : {
  async obtenerEstadisticas(filters?: ReporteFilters): Promise<ReporteEstadisticas> {
    // Postman: /api/v1/reportes/dashboard
    const { data } = await apiClient.get<ReporteEstadisticas>('/reportes/dashboard', {
      params: filters
    })
    return data
  },

  async obtenerTendencias(
    periodo: 'dia' | 'semana' | 'mes',
    filters?: ReporteFilters
  ): Promise<ReporteTendencias[]> {
    // No existe en postman
    console.warn('Endpoint tendencias no existe en Postman')
    return []
  },

  async exportarExcel(filters?: ReporteFilters): Promise<Blob> {
    // No existe en postman
    console.warn('Endpoint exportarExcel no existe en Postman')
    return new Blob([])
  },

  async exportarCSV(filters?: ReporteFilters): Promise<Blob> {
     // No existe en postman
     console.warn('Endpoint exportarCSV no existe en Postman')
     return new Blob([])
  }
}

export const reportesApi = api
