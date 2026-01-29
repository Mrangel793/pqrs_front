import apiClient from './axios'
import type { Usuario, PaginatedResponse, PaginationParams } from '@/types'

export const usuariosApi = {
  async listar(pagination?: PaginationParams): Promise<PaginatedResponse<Usuario>> {
    // Postman: /api/v1/usuarios/?skip=0&limit=100
    // Mapeamos pagination page/pageSize a skip/limit
    const params: any = {}
    if (pagination) {
        params.skip = (pagination.page - 1) * pagination.pageSize
        params.limit = pagination.pageSize
    }
    const { data } = await apiClient.get<any>('/usuarios/', {
      params
    })

    if (Array.isArray(data)) {
      return {
        data: data,
        total: data.length,
        page: pagination?.page || 1,
        pageSize: pagination?.pageSize || 100,
        totalPages: 1
      }
    }

    return data
  },

  async obtener(id: number): Promise<Usuario> {
    const { data } = await apiClient.get<Usuario>(`/usuarios/${id}`)
    return data
  },

  async crear(usuario: Partial<Usuario>): Promise<Usuario> {
    const { data } = await apiClient.post<Usuario>('/usuarios/', usuario)
    return data
  },

  async actualizar(id: number, updates: Partial<Usuario>): Promise<Usuario> {
    // Postman usa PUT para actualizar
    const { data } = await apiClient.put<Usuario>(`/usuarios/${id}`, updates)
    return data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/usuarios/${id}`)
  }
}
