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
        codigoEstado: 'EN_PROCESO',
        prioridad: 'alta',
        semaforoEstado: 'amarillo',
        semaforo: {
            codigo: 'AMARILLO',
            descripcion: 'Por vencer',
            colorHex: '#eab308'
        },
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
        codigoEstado: 'ABIERTO',
        prioridad: 'media',
        semaforoEstado: 'verde',
        semaforo: {
            codigo: 'VERDE',
            descripcion: 'A tiempo',
            colorHex: '#22c55e'
        },
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
        codigoEstado: 'ESCALADO',
        prioridad: 'critica',
        semaforoEstado: 'rojo',
        semaforo: {
            codigo: 'ROJO',
            descripcion: 'Vencido',
            colorHex: '#ef4444'
        },
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

    async obtener(id: number | string): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 300))
        console.log('🎭 Mock Obtener Caso:', id)
        const caso = MOCK_CASOS.find(c => c.id == id)
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
            codigoEstado: 'ABIERTO',
            semaforoEstado: 'verde',
            fechaCreacion: new Date().toISOString(),
            fechaRecepcion: new Date().toISOString(),
            fechaLimite: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            fechaUltimaActualizacion: new Date().toISOString(),
            etiquetas: casoData.etiquetas || [],
            adjuntos: [],
            escalamientos: [],
            historial: []
        }

        return nuevoCaso
    },

    async actualizar(id: number | string, updates: Partial<CasoFormData>): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log('🎭 Mock Actualizar Caso:', id, updates)
        const caso = MOCK_CASOS.find(c => c.id == id)
        if (!caso) throw new Error('Caso no encontrado')
        return { ...caso, ...updates }
    },

    async eliminar(id: number | string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Eliminar Caso:', id)
    },

    async asignar(id: number | string, agenteId: number): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Asignar Caso:', id, 'a agente', agenteId)
        const caso = MOCK_CASOS.find(c => c.id == id)
        if (!caso) throw new Error('Caso no encontrado')
        return { ...caso, responsableId: agenteId }
    },

    async asignarme(id: number | string): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Asignarme Caso:', id)
        const caso = MOCK_CASOS.find(c => c.id == id)
        if (!caso) throw new Error('Caso no encontrado')
        // Mock: Asignar a usuario ficticio ID 1
        return { ...caso, responsableId: 1, estado: 'en_proceso', codigoEstado: 'EN_PROCEOSO' }
    },

    async cambiarEstado(id: number | string, estado: string): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Cambiar Estado:', id, estado)
        const caso = MOCK_CASOS.find(c => c.id == id)
        if (!caso) throw new Error('Caso no encontrado')
        return { ...caso, estado: estado as any }
    },

    async cambiarPrioridad(id: number | string, prioridad: string): Promise<Caso> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Cambiar Prioridad:', id, prioridad)
        const caso = MOCK_CASOS.find(c => c.id == id)
        if (!caso) throw new Error('Caso no encontrado')
        return { ...caso, prioridad: prioridad as any }
    },

    async agregarComentario(id: number | string, comentario: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 400))
        console.log('🎭 Mock Agregar Comentario:', id, comentario)
    },

    async obtenerFiltros(): Promise<{ 
        tipos: string[], 
        estados: { value: number, label: string, codigo: string }[],
        prioridades: { value: number, label: string, codigo: string, color: string }[]
    }> {
        await new Promise(resolve => setTimeout(resolve, 300))
        return {
            tipos: ['peticion', 'queja', 'reclamo', 'sugerencia'],
            estados: [
                { value: 1, label: 'Abierto', codigo: 'ABIERTO' },
                { value: 2, label: 'En Proceso', codigo: 'EN_PROCESO' },
                { value: 3, label: 'Escalado', codigo: 'ESCALADO' },
                { value: 4, label: 'Cerrado', codigo: 'CERRADO' }
            ],
            prioridades: [
                { value: 1, label: 'Sin urgencia', codigo: 'VERDE', color: '#22C55E' },
                { value: 2, label: 'Pre-alerta', codigo: 'AMARILLA', color: '#FACC15' },
                { value: 3, label: 'Prioritario', codigo: 'NARANJA', color: '#F97316' },
                { value: 4, label: 'Crítico', codigo: 'ROJO', color: '#EF4444' }
            ]
        }
    }
}
