import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import type { Usuario, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!usuario.value)
  const isAdmin = computed(() => usuario.value?.rol === 'admin')
  const isSupervisor = computed(
    () => usuario.value?.rol === 'supervisor' || usuario.value?.rol === 'admin'
  )

  async function login(credentials: LoginCredentials) {
    try {
      loading.value = true
      error.value = null
      const response = await authApi.login(credentials)
      token.value = response.token
      usuario.value = response.usuario
      localStorage.setItem('auth_token', response.token)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      token.value = null
      usuario.value = null
      localStorage.removeItem('auth_token')
    }
  }

  async function fetchProfile() {
    try {
      loading.value = true
      usuario.value = await authApi.getProfile()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener perfil'
      if (err.response?.status === 401) {
        await logout()
      }
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(updates: Partial<Usuario>) {
    try {
      loading.value = true
      error.value = null
      usuario.value = await authApi.updateProfile(updates)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar perfil'
      return false
    } finally {
      loading.value = false
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    try {
      loading.value = true
      error.value = null
      await authApi.changePassword(currentPassword, newPassword)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cambiar contraseña'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    usuario,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isSupervisor,
    login,
    logout,
    fetchProfile,
    updateProfile,
    changePassword
  }
})
