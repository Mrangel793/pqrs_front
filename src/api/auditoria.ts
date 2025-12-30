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
    const { data } = await apiClient.get<PaginatedResponse<RegistroAuditoria>>('/auditoria/', {
      params: { ...filters, ...pagination }
    })
    return data
  },

  async obtener(id: number): Promise<RegistroAuditoria> {
    // No en postman main list, pero asumimos standard
    const { data } = await apiClient.get<RegistroAuditoria>(`/auditoria/${id}`)
    return data
  },

  async listarPorEntidad(entidad: string, entidadId: number): Promise<RegistroAuditoria[]> {
    // Postman solo tiene: /api/v1/auditoria/caso/{id}
    if (entidad === 'caso') {
        const { data } = await apiClient.get<RegistroAuditoria[]>(
          `/auditoria/caso/${entidadId}`
        )
        return data
    }
    // Falback
    const { data } = await apiClient.get<RegistroAuditoria[]>(
      `/auditoria/${entidad}/${entidadId}`
    )
    return data
  }
}
