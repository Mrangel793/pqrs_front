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

export interface Semaforo {
  codigo: string
  descripcion: string
  colorHex: string
}

export interface Caso {
  id: number | string
  numero: string
  tipo: TipoCaso
  titulo: string
  descripcion: string
  estado: EstadoCaso
  codigoEstado: string // Raw state code from backend (e.g. NUEVO, CERRADO)
  prioridad: Prioridad
  semaforo?: Semaforo
  semaforoEstado: EstadoSemaforo // Keep for backward compatibility if needed, or remove if verified unused by logic
  fechaCreacion: string
  fechaRecepcion: string
  fechaLimite: string
  fechaUltimaActualizacion: string
  ciudadanoNombre: string
  ciudadanoEmail: string
  ciudadanoTelefono?: string
  responsable?: Usuario
  responsableId?: number | string
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
  tipo?: string // Changed from TipoCaso to string to support dynamic values
  estado?: number // Changed from EstadoCaso to number (ID) as backend expects ID
  prioridad?: Prioridad
  semaforoEstado?: EstadoSemaforo
  agenteAsignadoId?: number
  categoria?: string
  fechaDesde?: string
  fechaHasta?: string
  busqueda?: string
  radicado?: string
}

// Tipos de escalamientos
export interface Escalamiento {
  id: number
  casoId: string
  deUsuarioId: number
  aUsuarioId: number
  observacion: string
  fechaEscalamiento: string
  de_usuario?: Usuario
  a_usuario?: Usuario
  // Mantenemos compatibilidad opcional si es necesario, o refactorizamos todo
  resuelto?: boolean
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

// Tipos de auditoría del backend
export interface TipoAccion {
  id: number
  codigo: string
  descripcion: string
}

export interface AuditoriaEvento {
  id: number
  casoId?: string
  usuarioId?: number
  tipoAccionId: number
  detalleJson?: string
  ipOrigen?: string
  fechaEvento: string
  tipo_accion?: TipoAccion
  usuario?: Usuario
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

// RF-06: Tipos para Editor de Respuesta
export interface RespuestaResponse {
  texto_html: string
  texto_adicional?: string
  ultima_modificacion: string
  modificado_por?: string
}

export interface ImagenRespuesta {
  url: string
  nombre: string
}

// RF-07: Tipos para Generación de PDF
export type TipoPlantillaPDF = 'FACTURA' | 'POSTILLA' | 'FALLA'

export interface PDFVersionInfo {
  adjunto_id: string
  version: number
  nombre_archivo: string
  tamanio_bytes: number
  created_at: string
}

export interface PDFGenerarRequest {
  tipo_plantilla: TipoPlantillaPDF
  texto_adicional?: string
}

export interface PDFGenerarResponse {
  version: number
  url_descarga: string
  fecha_generacion: string
}

// RF-04: Tipos para Alertas
export interface SemaforoBandeja {
  id: number
  codigo: string        // 'VERDE', 'AMARILLA', 'NARANJA', 'ROJO'
  color_hex: string
  cantidad: number
}

export interface AlertaBandeja {
  total_casos: number
  por_semaforo: SemaforoBandeja[]
  casos_vencidos: number
  casos_por_vencer: number
  casos_activos: number
}

export interface AlertaCasoItem {
  caso_id: string
  radicado: string
  tipo_tramite: string
  peticionario_nombre: string
  fecha_recepcion: string
  fecha_vencimiento: string
  dias_transcurridos: number
  dias_restantes: number
  semaforo_actual_id: number
  semaforo_actual_codigo: string
  color_hex: string
  estado_caso_id: number
  estado_caso_codigo: string
  responsable_nombre: string | null
  es_vencido: boolean
  es_pre_alerta: boolean
}

export interface AlertaCasoPaginado {
  total: number
  items: AlertaCasoItem[]
}
