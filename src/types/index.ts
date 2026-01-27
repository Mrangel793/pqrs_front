// Tipos de usuario y autenticación
export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: 'admin' | 'agente' | 'supervisor'
  activo: boolean
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}

// Tipos de casos PQR
export type TipoCaso = 'peticion' | 'queja' | 'reclamo' | 'sugerencia'
export type EstadoCaso = 'abierto' | 'en_proceso' | 'escalado' | 'cerrado' | 'pendiente'
export type Prioridad = 'baja' | 'media' | 'alta' | 'critica'
export type EstadoSemaforo = 'verde' | 'amarillo' | 'rojo'

export interface Caso {
  id: number | string
  numero: string
  tipo: TipoCaso
  titulo: string
  descripcion: string
  estado: EstadoCaso
  prioridad: Prioridad
  semaforoEstado: EstadoSemaforo
  fechaCreacion: string
  fechaRecepcion: string
  fechaLimite: string
  fechaUltimaActualizacion: string
  ciudadanoNombre: string
  ciudadanoEmail: string
  ciudadanoTelefono?: string
  agenteAsignado?: Usuario
  agenteAsignadoId?: number | string
  categoria: string
  subcategoria?: string
  etiquetas: string[]
  adjuntos: Adjunto[]
  escalamientos: Escalamiento[]
  historial: HistorialEvento[]
}

export interface CasoFormData {
  tipo: TipoCaso
  titulo: string
  descripcion: string
  prioridad: Prioridad
  ciudadanoNombre: string
  ciudadanoEmail: string
  ciudadanoTelefono?: string
  categoria: string
  subcategoria?: string
  etiquetas?: string[]
}

export interface CasoFilters {
  tipo?: TipoCaso
  estado?: EstadoCaso
  prioridad?: Prioridad
  semaforoEstado?: EstadoSemaforo
  agenteAsignadoId?: number
  categoria?: string
  fechaDesde?: string
  fechaHasta?: string
  busqueda?: string
}

// Tipos de escalamientos
export interface Escalamiento {
  id: number
  casoId: number
  nivel: number
  motivo: string
  descripcion: string
  escaladoPor: Usuario
  escaladoA?: Usuario
  fecha: string
  resuelto: boolean
  fechaResolucion?: string
}

export interface EscalamientoFormData {
  casoId: number | string
  motivo: string
  descripcion: string
  escaladoAId?: number | string
}

// Tipos de adjuntos
export interface Adjunto {
  id: number
  casoId: number
  nombre: string
  tipo: string
  tamaño: number
  url: string
  uploadedBy: Usuario
  fecha: string
}

// Tipos de historial
export type TipoEvento =
  | 'creacion'
  | 'asignacion'
  | 'cambio_estado'
  | 'cambio_prioridad'
  | 'escalamiento'
  | 'comentario'
  | 'adjunto'
  | 'resolucion'

export interface HistorialEvento {
  id: number
  casoId: number
  tipo: TipoEvento
  descripcion: string
  usuario: Usuario
  fecha: string
  metadata?: Record<string, any>
}

// Tipos de configuración
export interface ConfiguracionSemaforo {
  id: number
  tiempoPrioridadBaja: number
  tiempoPrioridadMedia: number
  tiempoPrioridadAlta: number
  tiempoPrioridadCritica: number
  porcentajeAmarillo: number
  porcentajeRojo: number
}

export interface ConfiguracionEscalamiento {
  id: number
  nivel: number
  tiempoLimite: number
  descripcion: string
  rolDestino: string
}

export interface ConfiguracionNotificacion {
  id: number
  tipo: 'email' | 'sistema'
  evento: string
  activo: boolean
  destinatarios: string[]
  plantilla: string
}

// Tipos de auditoría
export interface RegistroAuditoria {
  id: number
  usuario: Usuario
  accion: string
  entidad: string
  entidadId: number
  datosAnteriores?: Record<string, any>
  datosNuevos?: Record<string, any>
  fecha: string
  ip: string
}

// Tipos de reportes
export interface ReporteEstadisticas {
  totalCasos: number
  casosPorEstado: Record<EstadoCaso, number>
  casosPorTipo: Record<TipoCaso, number>
  casosPorPrioridad: Record<Prioridad, number>
  casosPorSemaforo: Record<EstadoSemaforo, number>
  tiempoPromedioResolucion: number
  tasaEscalamiento: number
  tasaSatisfaccion: number
}

export interface ReporteTendencias {
  periodo: string
  casosCreados: number
  casosCerrados: number
  tiempoPromedioResolucion: number
  escalamientos: number
}

// Tipos de paginación
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Tipos de respuestas API
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}

// Tipos de ingesta de documentos
export interface DocumentoIngesta {
  id: number
  nombre: string
  tipo: string
  estado: 'pendiente' | 'procesando' | 'completado' | 'error'
  textoExtraido?: string
  metadatos?: Record<string, any>
  casoGeneradoId?: number
  fecha: string
  procesadoPor?: Usuario
}

export interface IngestaFormData {
  archivo: File
  tipo: TipoCaso
  prioridad: Prioridad
  categoria: string
}
