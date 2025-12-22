import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usuariosApi } from '@/api/usuarios'
import type { Usuario, PaginationParams } from '@/types'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref<Usuario[]>([])
  const agentes = ref<Usuario[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Paginación
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const totalPages = ref(0)

  async function listar(pagination?: PaginationParams) {
    try {
      loading.value = true
      error.value = null
      const response = await usuariosApi.listar(pagination)
      usuarios.value = response.data
      total.value = response.total
      page.value = response.page
      pageSize.value = response.pageSize
      totalPages.value = response.totalPages
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar usuarios'
    } finally {
      loading.value = false
    }
  }

  async function listarAgentes() {
    try {
      loading.value = true
      error.value = null
      agentes.value = await usuariosApi.listarAgentes()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar agentes'
    } finally {
      loading.value = false
    }
  }

  async function obtener(id: number) {
    try {
      loading.value = true
      error.value = null
      return await usuariosApi.obtener(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al cargar usuario'
      return null
    } finally {
      loading.value = false
    }
  }

  async function crear(usuario: Partial<Usuario>) {
    try {
      loading.value = true
      error.value = null
      const nuevoUsuario = await usuariosApi.crear(usuario)
      usuarios.value.unshift(nuevoUsuario)
      return nuevoUsuario
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al crear usuario'
      return null
    } finally {
      loading.value = false
    }
  }

  async function actualizar(id: number, updates: Partial<Usuario>) {
    try {
      loading.value = true
      error.value = null
      const usuarioActualizado = await usuariosApi.actualizar(id, updates)

      const index = usuarios.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        usuarios.value[index] = usuarioActualizado
      }

      return usuarioActualizado
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar usuario'
      return null
    } finally {
      loading.value = false
    }
  }

  async function eliminar(id: number) {
    try {
      loading.value = true
      error.value = null
      await usuariosApi.eliminar(id)
      usuarios.value = usuarios.value.filter((u) => u.id !== id)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al eliminar usuario'
      return false
    } finally {
      loading.value = false
    }
  }

  async function activar(id: number) {
    try {
      loading.value = true
      error.value = null
      const usuarioActualizado = await usuariosApi.activar(id)

      const index = usuarios.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        usuarios.value[index] = usuarioActualizado
      }

      return usuarioActualizado
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al activar usuario'
      return null
    } finally {
      loading.value = false
    }
  }

  async function desactivar(id: number) {
    try {
      loading.value = true
      error.value = null
      const usuarioActualizado = await usuariosApi.desactivar(id)

      const index = usuarios.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        usuarios.value[index] = usuarioActualizado
      }

      return usuarioActualizado
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al desactivar usuario'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    usuarios,
    agentes,
    loading,
    error,
    total,
    page,
    pageSize,
    totalPages,
    listar,
    listarAgentes,
    obtener,
    crear,
    actualizar,
    eliminar,
    activar,
    desactivar
  }
})
