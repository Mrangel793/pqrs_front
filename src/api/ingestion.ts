import apiClient from './axios'
import type { DocumentoIngesta, IngestaFormData } from '@/types'

export const ingestionApi = {
  async subirDocumento(formData: IngestaFormData): Promise<DocumentoIngesta> {
    const data = new FormData()
    data.append('archivo', formData.archivo)
    data.append('tipo', formData.tipo)
    data.append('prioridad', formData.prioridad)
    data.append('categoria', formData.categoria)

    const { data: response } = await apiClient.post<DocumentoIngesta>(
      '/ingestion/documentos',
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response
  },

  async listarDocumentos(): Promise<DocumentoIngesta[]> {
    const { data } = await apiClient.get<DocumentoIngesta[]>('/ingestion/documentos')
    return data
  },

  async obtenerDocumento(id: number): Promise<DocumentoIngesta> {
    const { data } = await apiClient.get<DocumentoIngesta>(`/ingestion/documentos/${id}`)
    return data
  },

  async procesarDocumento(id: number): Promise<DocumentoIngesta> {
    const { data } = await apiClient.post<DocumentoIngesta>(
      `/ingestion/documentos/${id}/procesar`
    )
    return data
  },

  async eliminarDocumento(id: number): Promise<void> {
    await apiClient.delete(`/ingestion/documentos/${id}`)
  }
}
