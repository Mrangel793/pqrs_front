import { format, formatDistance, parseISO, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'
import type {
  TipoCaso,
  EstadoCaso,
  Prioridad,
  EstadoSemaforo,
  TipoEvento
} from '@/types'

// Formateo de fechas
export function formatDate(date: string | Date, formatStr = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: es })
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es })
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: es })
}

// Cálculo de semáforo
export function calcularSemaforo(
  fechaCreacion: string,
  fechaLimite: string,
  estado: EstadoCaso
): EstadoSemaforo {
  if (estado === 'cerrado') return 'verde'

  const now = new Date()
  const created = parseISO(fechaCreacion)
  const limit = parseISO(fechaLimite)

  const totalHours = differenceInHours(limit, created)
  const elapsedHours = differenceInHours(now, created)
  const percentage = (elapsedHours / totalHours) * 100

  if (percentage >= 90) return 'rojo'
  if (percentage >= 70) return 'amarillo'
  return 'verde'
}

// Formateo de valores
export function formatTipoCaso(tipo: TipoCaso): string {
  const tipos: Record<TipoCaso, string> = {
    peticion: 'Petición',
    queja: 'Queja',
    reclamo: 'Reclamo',
    sugerencia: 'Sugerencia'
  }
  return tipos[tipo] || tipo
}

export function formatEstadoCaso(estado: EstadoCaso): string {
  const estados: Record<EstadoCaso, string> = {
    abierto: 'Abierto',
    en_proceso: 'En Proceso',
    escalado: 'Escalado',
    cerrado: 'Cerrado',
    pendiente: 'Pendiente'
  }
  return estados[estado] || estado
}

export function formatPrioridad(prioridad: Prioridad): string {
  const prioridades: Record<Prioridad, string> = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
    critica: 'Crítica'
  }
  return prioridades[prioridad] || prioridad
}

export function formatTipoEvento(tipo: TipoEvento): string {
  const eventos: Record<TipoEvento, string> = {
    creacion: 'Creación',
    asignacion: 'Asignación',
    cambio_estado: 'Cambio de Estado',
    cambio_prioridad: 'Cambio de Prioridad',
    escalamiento: 'Escalamiento',
    comentario: 'Comentario',
    adjunto: 'Adjunto',
    resolucion: 'Resolución'
  }
  return eventos[tipo] || tipo
}

// Colores para badges y estados
export function getTipoCasoColor(tipo: TipoCaso): string {
  const colors: Record<TipoCaso, string> = {
    peticion: 'blue',
    queja: 'yellow',
    reclamo: 'red',
    sugerencia: 'green'
  }
  return colors[tipo] || 'gray'
}

export function getEstadoCasoColor(estado: EstadoCaso): string {
  const colors: Record<EstadoCaso, string> = {
    abierto: 'blue',
    en_proceso: 'yellow',
    escalado: 'orange',
    cerrado: 'green',
    pendiente: 'gray'
  }
  return colors[estado] || 'gray'
}

export function getPrioridadColor(prioridad: Prioridad): string {
  const colors: Record<Prioridad, string> = {
    baja: 'gray',
    media: 'blue',
    alta: 'orange',
    critica: 'red'
  }
  return colors[prioridad] || 'gray'
}

export function getSemaforoColor(semaforo: EstadoSemaforo): string {
  const colors: Record<EstadoSemaforo, string> = {
    verde: 'green',
    amarillo: 'yellow',
    rojo: 'red'
  }
  return colors[semaforo] || 'gray'
}

// Formateo de archivos
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

// Validaciones
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function isValidPhone(phone: string): boolean {
  const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  return re.test(phone)
}

// Utilidades de array
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key])
      if (!result[groupKey]) {
        result[groupKey] = []
      }
      result[groupKey].push(item)
      return result
    },
    {} as Record<string, T[]>
  )
}

// Debounce
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Generador de número de caso
export function generarNumeroCaso(tipo: TipoCaso): string {
  const prefix: Record<TipoCaso, string> = {
    peticion: 'PET',
    queja: 'QUE',
    reclamo: 'REC',
    sugerencia: 'SUG'
  }
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0')
  return `${prefix[tipo]}-${timestamp}-${random}`
}

// Descarga de archivos
export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Copiar al portapapeles
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err)
    return false
  }
}
