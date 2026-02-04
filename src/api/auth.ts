import apiClient from './axios'
import type { LoginCredentials, AuthResponse, Usuario } from '@/types'

export const authApi = {
  /**
   * Iniciar sesión con credenciales
   * Retorna access_token, refresh_token y datos del usuario
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Backend espera 'correo' en lugar de 'email'
    const payload = {
      correo: credentials.email,
      password: credentials.password
    }

    const { data } = await apiClient.post<any>('/auth/login', payload)
    
    // Adaptar respuesta del backend
    // Backend devuelve: { user: {...}, token: { access_token, refresh_token, token_type } }
    return {
      token: {
        access_token: data.token?.access_token || data.access_token,
        refresh_token: data.token?.refresh_token || data.refresh_token,
        token_type: data.token?.token_type || 'bearer'
      },
      usuario: data.user || data.usuario
    }
  },

  /**
   * Refrescar token de acceso usando refresh token
   * @param refreshToken - Token de refresco
   * @returns Nuevos tokens (access y refresh)
   */
  async refreshToken(refreshToken: string): Promise<{
    access_token: string
    refresh_token: string
  }> {
    const { data } = await apiClient.post<any>('/auth/refresh', {
      refresh_token: refreshToken
    })
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token
    }
  },

  /**
   * Cerrar sesión del usuario
   * Invalida todas las sesiones activas en el servidor
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(): Promise<Usuario> {
    const { data } = await apiClient.get<Usuario>('/auth/me')
    return data
  },

  /**
   * Actualizar datos del perfil del usuario
   */
  async updateProfile(updates: Partial<Usuario>): Promise<Usuario> {
    const { data } = await apiClient.patch<Usuario>('/auth/me', updates)
    return data
  },

  /**
   * Cambiar contraseña del usuario
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    })
  }
}
