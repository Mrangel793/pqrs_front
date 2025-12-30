import apiClient from './axios'
import type { LoginCredentials, AuthResponse, Usuario } from '@/types'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Backend espera 'correo' en lugar de 'email'
    const payload = {
      correo: credentials.email,
      password: credentials.password
    }

    const { data } = await apiClient.post<any>('/auth/login', payload)
    
    // Adaptar respuesta: backend devuelve { user: {...}, token: { access_token: "..." } }
    return {
      token: data.token?.access_token || data.access_token,
      usuario: data.user || data.usuario
    }
  },

  async refreshToken(token: string): Promise<string> {
    const { data } = await apiClient.post<any>('/auth/refresh', {
      refresh_token: token
    })
    return data.access_token
  },

  async logout(): Promise<void> {
    try {
        await apiClient.post('/auth/logout')
    } catch (e) {
        // Ignorar error si el endpoint no existe
    }
  },

  async getProfile(): Promise<Usuario> {
    const { data } = await apiClient.get<Usuario>('/auth/me')
    return data
  },

  async updateProfile(updates: Partial<Usuario>): Promise<Usuario> {
    const { data } = await apiClient.patch<Usuario>('/auth/me', updates)
    return data
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    })
  }
}
