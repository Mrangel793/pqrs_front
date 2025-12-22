import apiClient from './axios'

export const pdfApi = {
  async generarCaso(casoId: number): Promise<Blob> {
    const { data } = await apiClient.get(`/casos/${casoId}/pdf`, {
      responseType: 'blob'
    })
    return data
  },

  async generarReporte(tipo: string, filtros?: Record<string, any>): Promise<Blob> {
    const { data } = await apiClient.post(
      '/reportes/pdf',
      { tipo, filtros },
      {
        responseType: 'blob'
      }
    )
    return data
  }
}
