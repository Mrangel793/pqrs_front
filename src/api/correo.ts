import apiClient from './axios'

export interface EnvioCorreoData {
  destinatarios: string[]
  asunto: string
  mensaje: string
  adjuntos?: number[]
}

export const correoApi = {
  async enviarNotificacion(casoId: number, data: EnvioCorreoData): Promise<void> {
    await apiClient.post(`/casos/${casoId}/notificar`, data)
  },

  async enviarActualizacion(casoId: number, mensaje: string): Promise<void> {
    await apiClient.post(`/casos/${casoId}/enviar-actualizacion`, { mensaje })
  },

  async reenviarConfirmacion(casoId: number): Promise<void> {
    await apiClient.post(`/casos/${casoId}/reenviar-confirmacion`)
  }
}
