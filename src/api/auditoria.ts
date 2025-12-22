import apiClient from './axios'
import type { RegistroAuditoria, PaginatedResponse, PaginationParams } from '@/types'

export interface AuditoriaFilters {
  usuarioId?: number
  accion?: string
  entidad?: string
  fechaDesde?: string
  fechaHasta?: string
}

export const auditoriaApi = {
  async listar(
    filters?: AuditoriaFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<RegistroAuditoria>> {
    const { data } = await apiClient.get<PaginatedResponse<RegistroAuditoria>>('/auditoria', {
      params: { ...filters, ...pagination }
    })
    return data
  },

  async obtener(id: number): Promise<RegistroAuditoria> {
    const { data } = await apiClient.get<RegistroAuditoria>(`/auditoria/${id}`)
    return data
  },

  async listarPorEntidad(entidad: string, entidadId: number): Promise<RegistroAuditoria[]> {
    const { data } = await apiClient.get<RegistroAuditoria[]>(
      `/auditoria/${entidad}/${entidadId}`
    )
    return data
  }
}
