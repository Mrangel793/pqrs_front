import apiClient from './axios'
import type { PDFVersionInfo, PDFGenerarResponse, TipoPlantillaPDF } from '@/types'

export const pdfApi = {
  /**
   * Genera un nuevo PDF para el caso
   * POST /pqrs/{caso_id}/pdf/generar
   */
  async generar(
    casoId: number | string,
    tipoPlantilla: TipoPlantillaPDF,
    incluirImagenes: boolean = true
  ): Promise<PDFGenerarResponse> {
    const tipoPdfIdMap: Record<TipoPlantillaPDF, number> = {
      FACTURA: 1,
      POSTILLA: 2,
      FALLA: 3
    }

    const { data } = await apiClient.post(`/pqrs/${casoId}/pdf/generar`, {
      tipo_pdf_id: tipoPdfIdMap[tipoPlantilla],
      incluir_imagenes: incluirImagenes
    })
    return data
  },

  /**
   * Obtiene el historial de versiones de PDF generados
   * GET /pqrs/{caso_id}/pdf/versiones
   */
  async listarVersiones(casoId: number | string): Promise<PDFVersionInfo[]> {
    const { data } = await apiClient.get(`/pqrs/${casoId}/pdf/versiones`)
    return data
  },

  /**
   * Descarga una versión específica del PDF
   * GET /pqrs/{caso_id}/pdf/descargar?version=X
   */
  async descargarVersion(casoId: number | string, version: number): Promise<Blob> {
    const { data } = await apiClient.get(`/pqrs/${casoId}/pdf/descargar`, {
      params: { version },
      responseType: 'blob'
    })
    return data
  },

  /**
   * Descarga la última versión del PDF
   * GET /pqrs/{caso_id}/pdf/descargar
   */
  async descargar(casoId: number | string): Promise<Blob> {
    const { data } = await apiClient.get(`/pqrs/${casoId}/pdf/descargar`, {
      responseType: 'blob'
    })
    return data
  },

  /**
   * Preview de una versión específica (usa el mismo endpoint de descarga)
   * GET /pqrs/{caso_id}/pdf/descargar?version=X
   */
  async previewVersion(casoId: number | string, version: number): Promise<Blob> {
    return this.descargarVersion(casoId, version)
  },

  /**
   * Genera un PDF y lo descarga inmediatamente
   * Retorna el Blob para usar con useDownload
   */
  async generarYDescargar(
    casoId: number | string,
    tipoPlantilla: TipoPlantillaPDF = 'POSTILLA',
    incluirImagenes: boolean = true
  ): Promise<Blob> {
    // Primero generar
    const resultado = await this.generar(casoId, tipoPlantilla, incluirImagenes)
    // Luego descargar la versión generada
    return this.descargarVersion(casoId, resultado.version)
  },

  // Alias para compatibilidad (retorna Blob para useDownload)
  async generarCaso(casoId: number | string, tipoPlantilla: TipoPlantillaPDF = 'POSTILLA'): Promise<Blob> {
    return this.generarYDescargar(casoId, tipoPlantilla)
  }
}
