import apiClient from './axios'
import type {
  ConfiguracionSemaforo,
  ConfiguracionEscalamiento,
  ConfiguracionNotificacion
} from '@/types'

export const configuracionApi = {
  // Configuración de semáforo
  async obtenerSemaforo(): Promise<ConfiguracionSemaforo> {
    // Postman: GET /api/v1/configuracion/semaforo
    const { data } = await apiClient.get<ConfiguracionSemaforo>('/configuracion/semaforo')
    return data
  },

  async actualizarSemaforo(config: Partial<ConfiguracionSemaforo>): Promise<ConfiguracionSemaforo> {
    // Postman: PUT /api/v1/configuracion/semaforo
    const { data } = await apiClient.put<ConfiguracionSemaforo>('/configuracion/semaforo', config)
    return data
  },

  // Configuración de escalamientos
  async listarEscalamientos(): Promise<ConfiguracionEscalamiento[]> {
    // Asumimos key "escalamientos" devuelve lista o es otra estructura
    const { data } = await apiClient.get<ConfiguracionEscalamiento[]>('/configuracion/escalamientos')
    return data
  },

  async actualizarEscalamiento(
    id: number,
    config: Partial<ConfiguracionEscalamiento>
  ): Promise<ConfiguracionEscalamiento> {
    // Postman: PUT /api/v1/configuracion/{key}
    // Si Key es "escalamientos", talvez no sea UPDATE por ID aqui?
    // Postman no muestra update de sub-items de config. Mantenemos estructura pero con PUT
    const { data } = await apiClient.put<ConfiguracionEscalamiento>(
      `/configuracion/escalamientos/${id}`,
      config
    )
    return data
  },

  // Configuración de notificaciones
  async listarNotificaciones(): Promise<ConfiguracionNotificacion[]> {
    const { data } = await apiClient.get<ConfiguracionNotificacion[]>('/configuracion/notificaciones')
    return data
  },

  async actualizarNotificacion(
    id: number,
    config: Partial<ConfiguracionNotificacion>
  ): Promise<ConfiguracionNotificacion> {
    const { data } = await apiClient.put<ConfiguracionNotificacion>(
      `/configuracion/notificaciones/${id}`,
      config
    )
    return data
  }
}
