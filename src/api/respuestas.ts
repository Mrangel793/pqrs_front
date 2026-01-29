import apiClient from './axios'
import type { RespuestaResponse, ImagenRespuesta } from '@/types'

export const respuestasApi = {
  /**
   * Obtiene la respuesta actual (borrador o guardada) de un caso
   * GET /pqrs/{id}/respuesta
   */
  async obtener(casoId: number | string): Promise<RespuestaResponse> {
    const { data } = await apiClient.get(`/pqrs/${casoId}/respuesta`)
    return data
  },

  /**
   * Guarda el borrador de respuesta
   * PUT /pqrs/{id}/respuesta
   */
  async guardar(
    casoId: number | string,
    payload: { texto_html: string; texto_adicional?: string }
  ): Promise<RespuestaResponse> {
    const { data } = await apiClient.put(`/pqrs/${casoId}/respuesta`, payload)
    return data
  },

  /**
   * Sube una imagen para incrustar en la respuesta
   * POST /pqrs/{id}/respuesta/imagen
   */
  async subirImagen(casoId: number | string, archivo: File): Promise<ImagenRespuesta> {
    const formData = new FormData()
    formData.append('archivo', archivo)

    const { data } = await apiClient.post(`/pqrs/${casoId}/respuesta/imagen`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  }
}
