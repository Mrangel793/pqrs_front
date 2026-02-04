import axios from 'axios'
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// ============================================
// Sistema de Refresh Automático de Tokens
// ============================================

// Estado del proceso de refresh
let isRefreshing = false
// Cola de requests que esperan el refresh
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

/**
 * Procesa la cola de requests pendientes después de un refresh
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token)
    } else {
      prom.reject(error)
    }
  })
  failedQueue = []
}

/**
 * Maneja la expiración de sesión: limpia tokens y redirige a login
 */
const handleSessionExpired = () => {
  console.warn('Sesión expirada - redirigiendo a login')
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
  
  // Evitar múltiples redirecciones
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login'
  }
}

// ============================================
// Interceptor de Request
// ============================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// ============================================
// Interceptor de Response con Refresh Automático
// ============================================
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    // Si no hay config o response, rechazar directamente
    if (!originalRequest || !error.response) {
      return Promise.reject(error)
    }

    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                           originalRequest.url?.includes('/auth/refresh')
    
    // Si es error 401 y no es endpoint de auth y no hemos reintentado
    if (error.response.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      
      // Si ya estamos refrescando, encolar este request
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return apiClient(originalRequest)
        }).catch((err) => {
          return Promise.reject(err)
        })
      }

      // Marcar que estamos reintentando y que estamos en proceso de refresh
      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refresh_token')
      
      // Si no hay refresh token, ir directamente a login
      if (!refreshToken) {
        isRefreshing = false
        handleSessionExpired()
        return Promise.reject(error)
      }

      try {
        // Intentar refresh - Usar axios directo para evitar interceptores
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken
        })

        const { access_token, refresh_token: newRefreshToken } = response.data

        // Guardar nuevos tokens
        localStorage.setItem('auth_token', access_token)
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken)
        }

        // Procesar cola de requests pendientes
        processQueue(null, access_token)

        // Reintentar request original con nuevo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`
        }
        
        return apiClient(originalRequest)

      } catch (refreshError) {
        // Refresh falló - procesar cola con error y redirigir a login
        processQueue(refreshError, null)
        handleSessionExpired()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Para otros errores, rechazar normalmente
    return Promise.reject(error)
  }
)

export default apiClient
