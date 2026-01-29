import apiClient from './axios'
import type { PDFVersionInfo, PDFGenerarResponse, TipoPlantillaPDF } from '@/types'

export const pdfApi = {
  // Metodo legacy mapeado a uno de los nuevos
  async generarCaso(casoId: number | string): Promise<Blob> {
    return this.generarPostilla(casoId.toString())
  },

  async generarFactura(numeroFactura: string, cliente: string): Promise<Blob> {
    const { data } = await apiClient.post(
      '/pdf/factura',
      { numero_factura: numeroFactura, cliente },
      { responseType: 'blob' }
    )
    return data
  },

  async generarPostilla(numeroCaso: string): Promise<Blob> {
    const { data } = await apiClient.post(
      '/pdf/postilla-apostilla',
      { numero_caso: numeroCaso },
      { responseType: 'blob' }
    )
    return data
  },

  async generarFalla(numeroCaso: string): Promise<Blob> {
    const { data } = await apiClient.post(
      '/pdf/falla-no-respuesta',
      { numero_caso: numeroCaso },
      { responseType: 'blob' }
    )
    return data
  },

  // RF-07: Nuevos endpoints con versionado

  /**
   * Genera un nuevo PDF para el caso con plantilla institucional
   * POST /pqrs/{id}/pdf/generar
   */
  async generar(
    casoId: number | string,
    tipoPlantilla: TipoPlantillaPDF,
    textoAdicional?: string
  ): Promise<PDFGenerarResponse> {
    const { data } = await apiClient.post(`/pqrs/${casoId}/pdf/generar`, {
      tipo_plantilla: tipoPlantilla,
      texto_adicional: textoAdicional
    })
    return data
  },

  /**
   * Obtiene el historial de versiones de PDF generados
   * GET /pqrs/{id}/pdf/versiones
   */
  async listarVersiones(casoId: number | string): Promise<PDFVersionInfo[]> {
    const { data } = await apiClient.get(`/pqrs/${casoId}/pdf/versiones`)
    return data
  },

  /**
   * Descarga una versión específica del PDF
   * GET /pqrs/{id}/pdf/{version}/descargar
   */
  async descargarVersion(casoId: number | string, version: number): Promise<Blob> {
    const { data } = await apiClient.get(`/pqrs/${casoId}/pdf/${version}/descargar`, {
      responseType: 'blob'
    })
    return data
  },

  /**
   * Obtiene preview de una versión específica del PDF
   * GET /pqrs/{id}/pdf/{version}/preview
   */
  async previewVersion(casoId: number | string, version: number): Promise<Blob> {
    const { data } = await apiClient.get(`/pqrs/${casoId}/pdf/${version}/preview`, {
      responseType: 'blob'
    })
    return data
  },

  async generarReporte(tipo: string, filtros?: Record<string, any>): Promise<Blob> {
    console.warn('Endpoint PDF Reporte no definido explicitamente')
    return new Blob([])
  }
}
