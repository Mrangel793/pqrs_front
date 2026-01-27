import apiClient from './axios'

export interface EnvioCorreoData {
  destinatarios: string[]
  asunto: string
  mensaje: string
  adjuntos?: number[]
}

export const correoApi = {
  async enviarNotificacion(casoId: number | string, data: EnvioCorreoData): Promise<void> {
    // Postman: POST /api/v1/correo/send
    // Mapeamos lo que podamos. Backend espera: { "to": [], "subject": "", "body": "" }
    await apiClient.post('/correo/send', {
        to: data.destinatarios,
        subject: data.asunto,
        body: data.mensaje
    })
  },

  async enviarActualizacion(casoId: number, mensaje: string): Promise<void> {
    // No hay endpoint especifico, usamos send genericamente?
    // O lo ignoramos si no aplica.
    console.warn('Endpoint enviarActualizacion no mapeado en Postman, usando dummy send')
  },

  async reenviarConfirmacion(casoId: number): Promise<void> {
     // No existe en Postman
     console.warn('Endpoint reenviarConfirmacion no existe en Postman')
  },

  async obtenerInbox(top: number = 10): Promise<any[]> {
    const { data } = await apiClient.get('/correo/inbox', {
        params: { top }
    })
    return data
  }
}
