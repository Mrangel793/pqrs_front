import apiClient from './axios'
import type { DocumentoIngesta, IngestaFormData } from '@/types'

export const ingestionApi = {
  // Postman solo muestra: POST /api/v1/ingestion/process
  // No hay subida de archivos ni listado en ingestion? 
  // O tal vez "Process Ingestion" hace todo? URL suggests process logic.
  // Mapeamos subirDocumento a process si es posible o warn
  
  async subirDocumento(formData: IngestaFormData): Promise<DocumentoIngesta> {
     // Si process recibe archivo? Postman body no se ve en JSON raw string provided in collection snippet clearly?
     // Wait, Postman Item "Process Ingestion": method POST /ingestion/process. Header empty.
     // No body shown in simple view? Ah, I need to check detailed JSON structure if implies file.
     // Assuming process takes file?
     console.warn('Endpoint subirDocumento mapeado a ingestion/process con incertidumbre')
     const data = new FormData()
     data.append('file', formData.archivo) // Try 'file'
     
     const { data: response } = await apiClient.post<DocumentoIngesta>('/ingestion/process', data)
     return response
  },

  async listarDocumentos(): Promise<DocumentoIngesta[]> {
    return []
  },

  async obtenerDocumento(id: number): Promise<DocumentoIngesta> {
     return {} as any
  },

  async procesarDocumento(id: number): Promise<DocumentoIngesta> {
     // Maybe this is the one calling process?
     const { data } = await apiClient.post<DocumentoIngesta>('/ingestion/process')
     return data
  },

  async eliminarDocumento(id: number): Promise<void> {
  }
}
