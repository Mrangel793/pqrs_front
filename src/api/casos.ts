import apiClient from './axios'
import type {
  Caso,
  CasoFormData,
  CasoFilters,
  PaginatedResponse,
  PaginationParams
} from '@/types'

export const casosApi = {
  async listar(
    filters?: CasoFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Caso>> {
    const { data } = await apiClient.get<PaginatedResponse<Caso>>('/casos', {
      params: { ...filters, ...pagination }
    })
    return data
  },

  async obtener(id: number): Promise<Caso> {
    const { data } = await apiClient.get<Caso>(`/casos/${id}`)
    return data
  },

  async crear(casoData: CasoFormData): Promise<Caso> {
    const { data } = await apiClient.post<Caso>('/casos', casoData)
    return data
  },

  async actualizar(id: number, updates: Partial<CasoFormData>): Promise<Caso> {
    const { data } = await apiClient.patch<Caso>(`/casos/${id}`, updates)
    return data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/casos/${id}`)
  },

  async asignar(id: number, agenteId: number): Promise<Caso> {
    const { data } = await apiClient.post<Caso>(`/casos/${id}/asignar`, { agenteId })
    return data
  },

  async cambiarEstado(id: number, estado: string): Promise<Caso> {
    const { data } = await apiClient.post<Caso>(`/casos/${id}/estado`, { estado })
    return data
  },

  async cambiarPrioridad(id: number, prioridad: string): Promise<Caso> {
    const { data } = await apiClient.post<Caso>(`/casos/${id}/prioridad`, { prioridad })
    return data
  },

  async agregarComentario(id: number, comentario: string): Promise<void> {
    await apiClient.post(`/casos/${id}/comentarios`, { comentario })
  }
}
