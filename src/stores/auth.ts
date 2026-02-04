import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import type { Usuario, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))
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
      
      // Guardar tokens
      token.value = response.token.access_token
      refreshToken.value = response.token.refresh_token
      usuario.value = response.usuario
      
      // Persistir en localStorage
      localStorage.setItem('auth_token', response.token.access_token)
      if (response.token.refresh_token) {
        localStorage.setItem('refresh_token', response.token.refresh_token)
      }
      
      return true
    } catch (err: any) {
      if (err.response?.status === 401) {
        error.value = 'Credenciales incorrectas'
      } else if (!err.response) {
        error.value = 'Error de conexión con el servidor'
      } else {
        error.value = err.response?.data?.detail || err.response?.data?.message || 'Error al iniciar sesión'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      // Llamar al endpoint de logout para invalidar sesión en backend
      await authApi.logout()
    } catch (err) {
      // Ignorar error si falla - igual limpiamos localmente
      console.error('Error al cerrar sesión en servidor:', err)
    } finally {
      // Siempre limpiar estado local
      clearLocalSession()
    }
  }

  /**
   * Limpiar sesión local sin llamar al backend
   * Útil cuando el token ya expiró y logout fallaría
   */
  function clearLocalSession() {
    token.value = null
    refreshToken.value = null
    usuario.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  async function fetchProfile() {
    try {
      loading.value = true
      usuario.value = await authApi.getProfile()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al obtener perfil'
      // Si es 401, el interceptor de axios ya manejará el refresh o redirect
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

  /**
   * Inicializar store al cargar la app
   * Verifica si hay tokens guardados y carga el perfil
   */
  async function initialize() {
    if (token.value) {
      try {
        await fetchProfile()
      } catch (err) {
        // Si falla, el interceptor manejará el refresh o limpiará la sesión
        console.error('Error al inicializar sesión:', err)
      }
    }
  }

  return {
    // State
    usuario,
    token,
    refreshToken,
    loading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    isSupervisor,
    // Actions
    login,
    logout,
    clearLocalSession,
    fetchProfile,
    updateProfile,
    changePassword,
    initialize
  }
})
