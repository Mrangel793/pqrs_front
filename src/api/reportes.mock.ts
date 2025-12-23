import type { ReporteEstadisticas, ReporteTendencias } from '@/types'
import type { ReporteFilters } from './reportes'

// Mock data para reportes
const MOCK_ESTADISTICAS: ReporteEstadisticas = {
    totalCasos: 156,
    casosPorEstado: {
        abierto: 23,
        en_proceso: 45,
        escalado: 12,
        cerrado: 68,
        pendiente: 8
    },
    casosPorTipo: {
        peticion: 45,
        queja: 67,
        reclamo: 32,
        sugerencia: 12
    },
    casosPorPrioridad: {
        baja: 34,
        media: 78,
        alta: 32,
        critica: 12
    },
    casosPorSemaforo: {
        verde: 89,
        amarillo: 45,
        rojo: 22
    },
    tiempoPromedioResolucion: 4.5,
    tasaEscalamiento: 7.7,
    tasaSatisfaccion: 87.5
}

const MOCK_TENDENCIAS: ReporteTendencias[] = [
    {
        periodo: '2024-12-16',
        casosCreados: 12,
        casosCerrados: 8,
        tiempoPromedioResolucion: 4.2,
        escalamientos: 2
    },
    {
        periodo: '2024-12-17',
        casosCreados: 15,
        casosCerrados: 10,
        tiempoPromedioResolucion: 4.8,
        escalamientos: 1
    },
    {
        periodo: '2024-12-18',
        casosCreados: 18,
        casosCerrados: 12,
        tiempoPromedioResolucion: 4.5,
        escalamientos: 3
    }
]

export const mockReportesApi = {
    async obtenerEstadisticas(filters?: ReporteFilters): Promise<ReporteEstadisticas> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Obtener Estadísticas:', filters)
        return MOCK_ESTADISTICAS
    },

    async obtenerTendencias(
        periodo: 'dia' | 'semana' | 'mes',
        filters?: ReporteFilters
    ): Promise<ReporteTendencias[]> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Obtener Tendencias:', periodo, filters)
        return MOCK_TENDENCIAS
    },

    async exportarExcel(filters?: ReporteFilters): Promise<Blob> {
        await new Promise(resolve => setTimeout(resolve, 600))
        console.log('🎭 Mock Exportar Excel:', filters)
        return new Blob(['mock excel data'], { type: 'application/vnd.ms-excel' })
    },

    async exportarCSV(filters?: ReporteFilters): Promise<Blob> {
        await new Promise(resolve => setTimeout(resolve, 600))
        console.log('🎭 Mock Exportar CSV:', filters)
        return new Blob(['mock csv data'], { type: 'text/csv' })
    }
}
