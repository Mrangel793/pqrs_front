import type {
    Caso,
    CasoFormData,
    CasoFilters,
    PaginatedResponse,
    PaginationParams
} from '@/types'

// Mock data para casos
const MOCK_CASOS: Caso[] = [
    {
        id: 1,
        numero: 'PQR-2024-001',
        tipo: 'queja',
        titulo: 'Problema con facturación',
        descripcion: 'La factura del mes presenta cobros indebidos',
        estado: 'en_proceso',
        prioridad: 'alta',
        semaforoEstado: 'amarillo',
        fechaCreacion: '2024-12-20T10:00:00Z',
        fechaRecepcion: '2024-12-20T10:00:00Z',
        fechaLimite: '2024-12-25T10:00:00Z',
        fechaUltimaActualizacion: '2024-12-23T08:00:00Z',
        ciudadanoNombre: 'Juan Pérez',
        ciudadanoEmail: 'juan.perez@email.com',
        ciudadanoTelefono: '3001234567',
        categoria: 'Facturación',
        subcategoria: 'Cobros indebidos',
        etiquetas: ['urgente', 'facturación'],
        adjuntos: [],
        escalamientos: [],
        historial: []
    },
    {
        id: 2,
        numero: 'PQR-2024-002',
        tipo: 'peticion',
        titulo: 'Solicitud de información',
        descripcion: 'Requiero información sobre trámites',
        estado: 'abierto',
        prioridad: 'media',
        semaforoEstado: 'verde',
        fechaCreacion: '2024-12-22T14:00:00Z',
        fechaRecepcion: '2024-12-22T14:00:00Z',
        fechaLimite: '2024-12-27T14:00:00Z',
        fechaUltimaActualizacion: '2024-12-22T14:00:00Z',
        ciudadanoNombre: 'María González',
        ciudadanoEmail: 'maria.gonzalez@email.com',
        categoria: 'Información',
        etiquetas: ['trámites'],
        adjuntos: [],
        escalamientos: [],
        historial: []
    },
    {
        id: 3,
        numero: 'PQR-2024-003',
        tipo: 'reclamo',
        titulo: 'Servicio deficiente',
        descripcion: 'La atención recibida fue muy mala',
        estado: 'escalado',
        prioridad: 'critica',
        semaforoEstado: 'rojo',
        fechaCreacion: '2024-12-15T09:00:00Z',
        fechaRecepcion: '2024-12-15T09:00:00Z',
        fechaLimite: '2024-12-20T09:00:00Z',
        fechaUltimaActualizacion: '2024-12-23T07:00:00Z',
        ciudadanoNombre: 'Carlos Rodríguez',
        ciudadanoEmail: 'carlos.rodriguez@email.com',
        ciudadanoTelefono: '3009876543',
        categoria: 'Atención al cliente',
        etiquetas: ['escalado', 'urgente'],
        adjuntos: [],
        escalamientos: [],
        historial: []
    }
]

export const mockCasosApi = {
    async listar(
        filters?: CasoFilters,
        pagination?: PaginationParams
    ): Promise<PaginatedResponse<Caso>> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Listar Casos:', filters, pagination)

        const page = pagination?.page || 1
        const pageSize = pagination?.pageSize || 10
        const sortBy = pagination?.sortBy || 'fechaRecepcion'
        const sortOrder = pagination?.sortOrder || 'desc' // Default to DESC (Newest first)

        // 1. Clonar y Ordenar
        let filteredCasos = [...MOCK_CASOS]
        
        filteredCasos.sort((a, b) => {
            // Manejar campos de fecha
            if (sortBy === 'fechaRecepcion' || sortBy === 'fechaCreacion') {
                const dateA = new Date((a as any)[sortBy] || 0).getTime()
                const dateB = new Date((b as any)[sortBy] || 0).getTime()
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
            }
            
            // Manejar otros campos (fallback simple)
            return 0
        })

        // 2. Paginar
        const total = filteredCasos.length
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const paginatedData = filteredCasos.slice(start, end)

        return {
            data: paginatedData,
            total: total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }
    },

    async obtener(id: number): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 300))
        console.log('🎭 Mock Obtener Caso:', id)
        const caso = MOCK_CASOS.find(c => c.id === id)
        if (!caso) throw new Error('Caso no encontrado')
        return caso
    },

    async crear(casoData: CasoFormData): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log('🎭 Mock Crear Caso:', casoData)

        const nuevoCaso: Caso = {
            id: MOCK_CASOS.length + 1,
            numero: `PQR-2024-${String(MOCK_CASOS.length + 1).padStart(3, '0')}`,
            ...casoData,
            estado: 'abierto',
            semaforoEstado: 'verde',
            fechaCreacion: new Date().toISOString(),
            fechaLimite: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            fechaUltimaActualizacion: new Date().toISOString(),
            etiquetas: casoData.etiquetas || [],
            adjuntos: [],
            escalamientos: [],
            historial: []
        }

        return nuevoCaso
    },

    async actualizar(id: number, updates: Partial<CasoFormData>): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log('🎭 Mock Actualizar Caso:', id, updates)
        const caso = MOCK_CASOS.find(c => c.id === id)
        if (!caso) throw new Error('Caso no encontrado')
        return { ...caso, ...updates }
    },

    async eliminar(id: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Eliminar Caso:', id)
    },

    async asignar(id: number, agenteId: number): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Asignar Caso:', id, 'a agente', agenteId)
        const caso = MOCK_CASOS.find(c => c.id === id)
        if (!caso) throw new Error('Caso no encontrado')
        return { ...caso, agenteAsignadoId: agenteId }
    },

    async cambiarEstado(id: number, estado: string): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Cambiar Estado:', id, estado)
        const caso = MOCK_CASOS.find(c => c.id === id)
        if (!caso) throw new Error('Caso no encontrado')
        return { ...caso, estado: estado as any }
    },

    async cambiarPrioridad(id: number, prioridad: string): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Cambiar Prioridad:', id, prioridad)
        const caso = MOCK_CASOS.find(c => c.id === id)
        if (!caso) throw new Error('Caso no encontrado')
        return { ...caso, prioridad: prioridad as any }
    },

    async agregarComentario(id: number, comentario: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Agregar Comentario:', id, comentario)
    }
}
