import apiClient from './axios'
import type { Escalamiento, EscalamientoFormData } from '@/types'

export const escalamientosApi = {
  async listar(casoId: number): Promise<Escalamiento[]> {
    const { data } = await apiClient.get<Escalamiento[]>(
      `/casos/${casoId}/escalamientos`
    )
    return data
  },

  async crear(escalamientoData: EscalamientoFormData): Promise<Escalamiento> {
    const { data } = await apiClient.post<Escalamiento>(
      `/casos/${escalamientoData.casoId}/escalamientos`,
      escalamientoData
    )
    return data
  },

  async resolver(id: number, resolucion: string): Promise<Escalamiento> {
    const { data } = await apiClient.post<Escalamiento>(
      `/escalamientos/${id}/resolver`,
      { resolucion }
    )
    return data
  },

  async obtenerPendientes(): Promise<Escalamiento[]> {
    const { data } = await apiClient.get<Escalamiento[]>('/escalamientos/pendientes')
    return data
  }
}
