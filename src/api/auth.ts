import apiClient from './axios'
import type { LoginCredentials, AuthResponse, Usuario } from '@/types'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async getProfile(): Promise<Usuario> {
    const { data } = await apiClient.get<Usuario>('/auth/profile')
    return data
  },

  async updateProfile(updates: Partial<Usuario>): Promise<Usuario> {
    const { data } = await apiClient.patch<Usuario>('/auth/profile', updates)
    return data
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const { data } = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return data
  }
}
