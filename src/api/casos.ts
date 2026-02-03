import apiClient from './axios'
import type {
  Caso,
  CasoFormData,
  CasoFilters,
  PaginatedResponse,
  PaginationParams
} from '@/types'
import { mockCasosApi } from './casos.mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const api = USE_MOCK ? mockCasosApi : {
  async listar(
    filters?: CasoFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Caso>> {
    // Postman: /api/v1/casos/?page=1&page_size=10
    const params: any = { ...filters }
    const page = pagination?.page || 1
    const pageSize = pagination?.pageSize || 10

    // Mapeo de filtros frontend -> backend
    if (filters?.estado) {
        params.estadoCasoId = filters.estado
        delete params.estado
    }
    if (filters?.tipo) {
        params.tipoTramite = filters.tipo
        delete params.tipo
    }


    if (filters?.prioridad) {
        params.semaforoId = filters.prioridad
        delete params.prioridad
    }
    
    if (pagination) {
        params.page = page
        params.page_size = pageSize
    }

    // Ordenamiento: más recientes primero
    // Enviamos múltiples formatos para asegurar que el backend lo entienda
    params.sort_by = pagination?.sortBy || 'fechaRecepcion'
    params.sortBy = pagination?.sortBy || 'fechaRecepcion'
    
    // Dirección: descendente
    const direction = pagination?.sortOrder === 'asc' ? 'asc' : 'desc'
    params.sort_order = direction
    params.order = direction
    params.direction = direction
    
    // Alternativa común en backends (Django style)
    params.ordering = direction === 'desc' ? '-fechaRecepcion' : 'fechaRecepcion'

    // Backend devuelve { total: number, items: [...] }
    const { data: backendResponse } = await apiClient.get<any>('/casos/', {
      params
    })

    let itemsAdaptados = (backendResponse.items || []).map(adaptarCaso)

    // Ordenar en frontend como fallback (más recientes primero)
    itemsAdaptados.sort((a: Caso, b: Caso) => {
      const dateA = new Date(a.fechaRecepcion).getTime()
      const dateB = new Date(b.fechaRecepcion).getTime()
      return dateB - dateA // Descendente: más reciente primero
    })

    return {
      data: itemsAdaptados,
      total: backendResponse.total || 0,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil((backendResponse.total || 0) / pageSize)
    }
  },

  async obtener(id: number | string): Promise<Caso> {
    const { data } = await apiClient.get<any>(`/casos/${id}`)
    return adaptarCaso(data)
  },

  async crear(casoData: CasoFormData): Promise<Caso> {
    const { data } = await apiClient.post<any>('/casos/', casoData)
    return adaptarCaso(data)
  },

  async actualizar(id: number, updates: Partial<CasoFormData> | any): Promise<Caso> {
    // Postman usa PUT
    const { data } = await apiClient.put<any>(`/casos/${id}`, updates)
    return adaptarCaso(data)
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/casos/${id}`)
  },

  // Helpers que usan actualizar (PUT) internamente ya que no hay endpoints dedicados en Postman
  async asignar(id: number, agenteId: number): Promise<Caso> {
    return this.actualizar(id, { agente_asignado_id: agenteId })
  },

  async asignarme(id: number | string): Promise<Caso> {
    const { data } = await apiClient.post<any>(`/casos/${id}/asignar-me`)
    return adaptarCaso(data)
  },

  async cambiarEstado(id: number, estado: string): Promise<Caso> {
    return this.actualizar(id, { estado })
  },

  async cambiarPrioridad(id: number, prioridad: string): Promise<Caso> {
    return this.actualizar(id, { prioridad })
  },

  async agregarComentario(id: number, comentario: string): Promise<void> {
    // No hay endpoint de comentarios en Postman. 
    // Intentamos enviarlo como actualización o lo dejamos pendiente
    console.warn('Endpoint de comentarios no definido en Postman')
  },

  async obtenerFiltros(): Promise<{ 
    tipos: string[], 
    estados: { value: number, label: string, codigo: string }[],
    prioridades: { value: number, label: string, codigo: string, color: string }[]
  }> {
    const { data } = await apiClient.get<any>('/casos/filtros')
    return data
  }
}

export const casosApi = api

function adaptarCaso(data: any): Caso {
  // Mapeo de campos backend -> frontend
  return {
    id: data.id, // UUID string del backend
    numero: data.radicado || data.numero || 'Sin Radicado',
    tipo: data.tipoTramite?.toLowerCase() || 'peticion',
    titulo: data.detalleSolicitud ? data.detalleSolicitud.substring(0, 50) + '...' : 'Sin Título',
    descripcion: data.detalleSolicitud || '',
    estado: data.estado_caso?.nombre?.toLowerCase().replace(' ', '_') || 'abierto',
    codigoEstado: data.estadoCasoId?.codigo || data.estado_caso?.codigo || 'SIN ESTADO',
    semaforo: data.semaforo || {
      codigo: 'VERDE',
      descripcion: 'A tiempo',
      colorHex: '#22c55e'
    },
    semaforoEstado: data.semaforo?.codigo?.toLowerCase() || 'verde',
    prioridad: mapearPrioridad(data.semaforo?.codigo),
    fechaCreacion: data.createdAt || new Date().toISOString(),
    fechaRecepcion: data.fechaRecepcion || data.createdAt || new Date().toISOString(),
    fechaLimite: data.fechaVencimiento || new Date().toISOString(),
    fechaUltimaActualizacion: data.updatedAt || new Date().toISOString(),
    ciudadanoNombre: data.peticionarioNombre || 'Anónimo',
    ciudadanoEmail: data.peticionarioCorreo || '',
    ciudadanoTelefono: data.peticionarioTelefono || '',
    responsable: data.responsable || null,
    responsableId: data.responsableId || null,
    categoria: data.categoria || 'General',
    subcategoria: data.subcategoria || '',
    etiquetas: data.etiquetas || [],
    adjuntos: data.adjuntos || [],
    escalamientos: data.escalamientos || [],
    historial: data.historial || []
  }
}

function mapearPrioridad(semaforoCodigo?: string): 'baja' | 'media' | 'alta' | 'critica' {
  if (!semaforoCodigo) return 'media'
  const map: Record<string, 'baja' | 'media' | 'alta' | 'critica'> = {
    'VERDE': 'baja',
    'AMARILLA': 'media',
    'NARANJA': 'alta',
    'ROJO': 'critica'
  }
  return map[semaforoCodigo] || 'media'
}
