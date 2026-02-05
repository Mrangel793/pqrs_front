import apiClient from './axios'
import type { AlertaBandeja, AlertaCasoPaginado, AlertaCasoItem, PaginationParams } from '@/types'

export const alertasApi = {
  async obtenerBandeja(misCasos = false): Promise<AlertaBandeja> {
    const { data } = await apiClient.get<AlertaBandeja>('/alertas/bandeja', {
      params: { mis_casos: misCasos }
    })
    return data
  },

  async listarVencidos(pagination?: PaginationParams, misCasos = false): Promise<AlertaCasoPaginado> {
    const { data } = await apiClient.get<AlertaCasoPaginado>('/alertas/vencidos', {
      params: {
        page: pagination?.page || 1,
        page_size: pagination?.pageSize || 20,
        mis_casos: misCasos
      }
    })
    return data
  },

  async listarPorVencer(pagination?: PaginationParams, misCasos = false): Promise<AlertaCasoPaginado> {
    const { data } = await apiClient.get<AlertaCasoPaginado>('/alertas/por-vencer', {
      params: {
        page: pagination?.page || 1,
        page_size: pagination?.pageSize || 20,
        mis_casos: misCasos
      }
    })
    return data
  },

  async obtenerAlertaCaso(id: string): Promise<AlertaCasoItem> {
    const { data } = await apiClient.get<AlertaCasoItem>(`/alertas/caso/${id}`)
    return data
  }
}
