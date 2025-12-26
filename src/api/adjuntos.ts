import apiClient from './axios'
import type { Adjunto } from '@/types'

export const adjuntosApi = {
  async listar(casoId: number): Promise<Adjunto[]> {
    // Postman: GET /api/v1/adjuntos/caso/{id}
    const { data } = await apiClient.get<Adjunto[]>(`/adjuntos/caso/${casoId}`)
    return data
  },

  async subir(casoId: number, file: File): Promise<Adjunto> {
    const formData = new FormData()
    formData.append('file', file)

    // Postman: POST /api/v1/adjuntos/?caso_id=1
    const { data } = await apiClient.post<Adjunto>(
      `/adjuntos/?caso_id=${casoId}`,
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
    // Postman: GET /api/v1/adjuntos/{id}
    const { data } = await apiClient.get(`/adjuntos/${id}`, {
      responseType: 'blob'
    })
    return data
  }
}
