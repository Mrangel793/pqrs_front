import apiClient from './axios'
import type {
  ConfiguracionSemaforo,
  ConfiguracionEscalamiento,
  ConfiguracionNotificacion
} from '@/types'

export const configuracionApi = {
  // Configuración de semáforo
  async obtenerSemaforo(): Promise<ConfiguracionSemaforo> {
    const { data } = await apiClient.get<ConfiguracionSemaforo>('/configuracion/semaforo')
    return data
  },

  async actualizarSemaforo(config: Partial<ConfiguracionSemaforo>): Promise<ConfiguracionSemaforo> {
    const { data } = await apiClient.patch<ConfiguracionSemaforo>('/configuracion/semaforo', config)
    return data
  },

  // Configuración de escalamientos
  async listarEscalamientos(): Promise<ConfiguracionEscalamiento[]> {
    const { data } = await apiClient.get<ConfiguracionEscalamiento[]>('/configuracion/escalamientos')
    return data
  },

  async actualizarEscalamiento(
    id: number,
    config: Partial<ConfiguracionEscalamiento>
  ): Promise<ConfiguracionEscalamiento> {
    const { data } = await apiClient.patch<ConfiguracionEscalamiento>(
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
    const { data } = await apiClient.patch<ConfiguracionNotificacion>(
      `/configuracion/notificaciones/${id}`,
      config
    )
    return data
  }
}
