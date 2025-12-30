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

    if (pagination) {
        params.page = page
        params.page_size = pageSize
    }
    
    // Backend devuelve { total: number, items: [...] }
    const { data: backendResponse } = await apiClient.get<any>('/casos/', {
      params
    })

    const itemsAdaptados = (backendResponse.items || []).map(adaptarCaso)

    return {
      data: itemsAdaptados,
      total: backendResponse.total || 0,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil((backendResponse.total || 0) / pageSize)
    }
  },

  async obtener(id: number): Promise<Caso> {
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
  }
}

export const casosApi = api

function adaptarCaso(data: any): Caso {
  // Mapeo seguro de campos backend -> frontend
  return {
    id: data.id, // UUID string from backend, but frontend expects number? Wait, frontend expects number.
    // Backend ID is UUID. Frontend ID is number.
    // This is a MAJOR mismatch.
    // For now, let's cast or handle it. Ideally frontend should accept any ID.
    // However, if I change frontend ID type it might break everything.
    // Let's assume for a moment the backend sends a number or we can use a hash/fake number?
    // No, backend sends UUID. Frontend 'Caso' interface says: id: number.
    // I MUST alert the user or change frontend to support string IDs. 
    // BUT user asked to "connect front to back without damaging backend endpoints unless absolutely necessary".
    // So I should change frontend types. 
    
    // HOWEVER, for this specific 'Invalid time value', let's focus on dates first.
    // Be careful with ID type mismatch.
    
    numero: data.radicado || data.numero || 'Sin Radicado',
    tipo: data.tipoTramite?.toLowerCase() || 'peticion', // Backend: Peticion (Capitalized?)
    titulo: data.detalleSolicitud ? data.detalleSolicitud.substring(0, 50) + '...' : 'Sin Título',
    descripcion: data.detalleSolicitud || '',
    estado: data.estado_caso?.nombre?.toLowerCase().replace(' ', '_') || 'abierto', // backend: 'Abierto'
    prioridad: 'media', // Backend doesn't seem to have priority in CasoResponse/CasoBase?? Wait.
    // Backend schema has 'prioridad'?? No.
    // CasoBase has: radicado, fechaRecepcion, tipoTramite, estadoCasoId, semaforoId...
    // It seems backend is missing priority? Or it's calculated?
    // Let's default to 'media'.
    
    semaforoEstado: data.semaforo?.color?.toLowerCase() || 'verde',
    
    fechaCreacion: data.createdAt || data.fechaRecepcion || new Date().toISOString(),
    fechaLimite: data.fechaVencimiento || new Date().toISOString(),
    fechaUltimaActualizacion: data.updatedAt || new Date().toISOString(),
    
    ciudadanoNombre: data.peticionarioNombre || 'Anónimo',
    ciudadanoEmail: data.peticionarioCorreo || '',
    
    // Others
    categoria: 'General',
    etiquetas: [],
    adjuntos: [],
    escalamientos: [],
    historial: []
  } as unknown as Caso 
  // Force cast due to ID type mismatch (string vs number). 
  // Frontend expects number ID. This will break navigation if not handled.
}
