import apiClient from './axios'
import type { Escalamiento, EscalamientoFormData } from '@/types'

export const escalamientosApi = {
  async listar(casoId?: number): Promise<Escalamiento[]> {
    // Postman: /api/v1/escalamientos/
    // Si pasamos casoId, intentamos filtrar por query param
    const url = casoId ? `/escalamientos/?caso_id=${casoId}` : '/escalamientos/'
    const { data } = await apiClient.get<Escalamiento[]>(url)
    return data
  },

  async crear(escalamientoData: EscalamientoFormData): Promise<Escalamiento> {
    const { data } = await apiClient.post<Escalamiento>(
      '/escalamientos/',
      escalamientoData
    )
    return data
  },

  async resolver(id: number, resolucion: string): Promise<Escalamiento> {
    // Postman usa PUT
    const { data } = await apiClient.put<Escalamiento>(
      `/escalamientos/${id}`,
      { resolucion }
    )
    return data
  },

  async obtenerPendientes(): Promise<Escalamiento[]> {
    // No existe en Postman, intentamos filtrar la lista normal
    // Ojo: esto podría traer todos
    const { data } = await apiClient.get<Escalamiento[]>('/escalamientos/')
    return data
  }
}
