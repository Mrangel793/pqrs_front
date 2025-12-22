import apiClient from './axios'
import type { Adjunto } from '@/types'

export const adjuntosApi = {
  async listar(casoId: number): Promise<Adjunto[]> {
    const { data } = await apiClient.get<Adjunto[]>(`/casos/${casoId}/adjuntos`)
    return data
  },

  async subir(casoId: number, file: File): Promise<Adjunto> {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await apiClient.post<Adjunto>(
      `/casos/${casoId}/adjuntos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/adjuntos/${id}`)
  },

  async descargar(id: number): Promise<Blob> {
    const { data } = await apiClient.get(`/adjuntos/${id}/descargar`, {
      responseType: 'blob'
    })
    return data
  }
}
