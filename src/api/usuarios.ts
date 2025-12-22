import apiClient from './axios'
import type { Usuario, PaginatedResponse, PaginationParams } from '@/types'

export const usuariosApi = {
  async listar(pagination?: PaginationParams): Promise<PaginatedResponse<Usuario>> {
    const { data } = await apiClient.get<PaginatedResponse<Usuario>>('/usuarios', {
      params: pagination
    })
    return data
  },

  async obtener(id: number): Promise<Usuario> {
    const { data } = await apiClient.get<Usuario>(`/usuarios/${id}`)
    return data
  },

  async crear(usuario: Partial<Usuario>): Promise<Usuario> {
    const { data } = await apiClient.post<Usuario>('/usuarios', usuario)
    return data
  },

  async actualizar(id: number, updates: Partial<Usuario>): Promise<Usuario> {
    const { data } = await apiClient.patch<Usuario>(`/usuarios/${id}`, updates)
    return data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/usuarios/${id}`)
  },

  async activar(id: number): Promise<Usuario> {
    const { data } = await apiClient.post<Usuario>(`/usuarios/${id}/activar`)
    return data
  },

  async desactivar(id: number): Promise<Usuario> {
    const { data } = await apiClient.post<Usuario>(`/usuarios/${id}/desactivar`)
    return data
  },

  async listarAgentes(): Promise<Usuario[]> {
    const { data } = await apiClient.get<Usuario[]>('/usuarios/agentes')
    return data
  }
}
