import apiClient from './axios'

export const pdfApi = {
  // Metodo legacy mapeado a uno de los nuevos
  async generarCaso(casoId: number): Promise<Blob> {
    // Por defecto generamos postilla/apostilla usando el ID como numero_caso?
    // Postman usa "numero_caso": "C-001" en body.
    // Asumimos que podemos enviar el ID o que el backend acepta ID.
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

  async generarReporte(tipo: string, filtros?: Record<string, any>): Promise<Blob> {
    // Postman no muestra endpoint de reportes PDF genericos
    // Intentamos usar el endpoint de reportes si existe, o dejamos este como estaba
    // pero apuntando a reportes
    console.warn('Endpoint PDF Reporte no definido explicitamente')
    return new Blob([])
  }
}
