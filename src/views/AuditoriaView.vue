<template>
  <AppLayout>
    <div class="grid grid-cols-12 gap-8 py-4">
      <!-- Sidebar Filters -->
      <aside class="col-span-12 lg:col-span-3 space-y-8 pr-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900 mb-6">Filtros</h2>
          <div class="inline-flex px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium mb-6">
            5 filtros activos
          </div>
        </div>

        <!-- Tipo de Acción -->
        <div class="space-y-4">
          <h3 class="font-bold text-gray-900 text-sm">Tipo de Acción</h3>
          <div class="space-y-3">
            <label v-for="type in actionTypes" :key="type.id" class="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" v-model="filters.actions" :value="type.id" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{{ type.label }}</span>
            </label>
          </div>
        </div>

        <!-- Usuario -->
        <div class="space-y-4">
          <h3 class="font-bold text-gray-900 text-sm">Usuario que ejecutó</h3>
          <BaseSelect
            v-model="filters.usuarioId"
            placeholder="Seleccionar Usuario"
            :options="usuarioOptions"
          />
          <label class="flex items-start gap-3 cursor-pointer group pt-2">
            <input type="checkbox" v-model="filters.includeSystemActions" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5" />
            <span class="text-xs text-gray-600 leading-tight">Incluir acciones del sistema<br/>(automáticas)</span>
          </label>
        </div>

        <!-- Caso (Radicado) -->
        <div class="space-y-4">
          <h3 class="font-bold text-gray-900 text-sm">Caso (Radicado)</h3>
          <BaseInput v-model="filters.radicado" placeholder="ej., RAD-2024-001" />
          <div class="flex justify-end">
            <button type="button" class="text-sm px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Buscar Caso
            </button>
          </div>
        </div>

        <!-- Estado del Caso -->
        <div class="space-y-4">
          <h3 class="font-bold text-gray-900 text-sm">Estado del Caso al momento</h3>
          <BaseSelect
            v-model="filters.estado"
            placeholder="Cualquier Estado"
            :options="estadoOptions"
          />
        </div>

        <!-- Resultado de Acción -->
        <div class="space-y-4">
          <h3 class="font-bold text-gray-900 text-sm">Resultado de Acción</h3>
          <div class="space-y-2">
            <button 
              v-for="res in resultOptions" 
              :key="res.id"
              @click="filters.result = res.id"
              :class="[
                'w-full flex items-center justify-between p-3 border rounded-xl transition-all text-left',
                filters.result === res.id ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 hover:border-blue-300'
              ]"
            >
              <div class="flex items-center gap-3">
                <div :class="['h-5 w-5 rounded-full border flex items-center justify-center', filters.result === res.id ? 'border-blue-500' : 'border-gray-300']">
                  <div v-if="filters.result === res.id" class="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                </div>
                <span class="text-sm font-medium text-gray-700">{{ res.label }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-3 pt-4 border-t border-gray-100">
          <BaseButton block @click="applyFilters">Aplicar Filtros</BaseButton>
          <BaseButton variant="secondary" block @click="clearFilters">Limpiar Filtros</BaseButton>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="col-span-12 lg:col-span-9 space-y-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900">Auditoría y Trazabilidad</h1>
          <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Exportar Log Completo
          </button>
        </div>

        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por radicado, usuario, acción..." 
            class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>

        <div class="inline-flex px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
          Mostrando resultados de: [rango de fechas]
        </div>

        <!-- Summary Stats -->
        <section class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <span class="text-sm font-medium text-gray-500">{{ stat.label }}</span>
            <div class="text-3xl font-bold text-gray-900">{{ stat.value }}</div>
          </div>
        </section>

        <!-- Timeline Section -->
        <section class="space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">Línea de Tiempo de Auditoría</h2>
            <div class="flex p-1 bg-gray-100 rounded-xl">
              <button 
                @click="activeView = 'timeline'" 
                :class="['px-6 py-1.5 rounded-lg text-sm font-medium transition-all', activeView === 'timeline' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500']"
              >
                Vista Timeline
              </button>
              <button 
                @click="activeView = 'table'" 
                :class="['px-6 py-1.5 rounded-lg text-sm font-medium transition-all', activeView === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500']"
              >
                Vista Tabla
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <BaseSelect v-model="timelineFilter1" :options="[]" placeholder="Filtrar por..." />
            <BaseSelect v-model="timelineFilter2" :options="[]" placeholder="Ordenar por..." />
          </div>

          <div class="text-sm text-blue-500/80 font-medium">
            Mostrando 50 de 1,247 eventos
          </div>

          <!-- Event Timeline -->
          <div class="space-y-0 pl-4 border-l-2 border-gray-100 ml-4">
            <div v-for="(event, index) in events" :key="index" class="relative pb-10 group last:pb-0">
              <!-- Connector dot replaced by Icon container -->
              <div class="absolute -left-[2.15rem] top-0 h-10 w-10 flex items-center justify-center bg-white border border-gray-100 shadow-sm rounded-xl">
                <component :is="event.icon" class="h-5 w-5 text-gray-600" />
              </div>
              
              <div class="space-y-1">
                <h4 class="font-bold text-gray-900">{{ event.title }}</h4>
                <p class="text-sm text-gray-500 font-medium">{{ event.description }}</p>
                <div v-if="event.meta" class="text-sm text-blue-600/90 font-medium pt-1">
                  {{ event.meta }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center pt-8">
            <button class="px-8 py-2.5 bg-gray-100 text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
              Cargar 50 Eventos Más
            </button>
          </div>
        </section>
      </main>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowRightIcon,
  UsersIcon,
  DocumentTextIcon,
  XMarkIcon,
  EnvelopeIcon 
} from '@heroicons/vue/24/outline'

interface AuditEvent {
  title: string
  description: string
  icon: any
  meta?: string
}

const activeView = ref('timeline')
const timelineFilter1 = ref('')
const timelineFilter2 = ref('')

const filters = ref({
  actions: ['estados'],
  usuarioId: '',
  includeSystemActions: false,
  radicado: '',
  estado: '',
  result: 'todas'
})

const actionTypes = [
  { id: 'estados', label: 'Estados' },
  { id: 'escalamiento', label: 'Escalamiento' },
  { id: 'respuesta', label: 'Respuesta' },
  { id: 'correo', label: 'Correo electrónico' }
]

const usuarioOptions = [
  { value: 1, label: 'Admin Usuario' },
  { value: 2, label: 'Agente Soporte' }
]

const estadoOptions = [
  { value: 'abierto', label: 'Abierto' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'cerrado', label: 'Cerrado' }
]

const resultOptions = [
  { id: 'todas', label: 'Todas' },
  { id: 'exitosas', label: 'Solo Exitosas' },
  { id: 'fallidas', label: 'Solo Fallidas' }
]

const stats = [
  { label: 'Total de Eventos', value: '1,247' },
  { label: 'Cambios de Estado', value: '342' },
  { label: 'Escalamientos', value: '89' },
  { label: 'PDFs Generados', value: '156' }
]

const events = ref<AuditEvent[]>([
  { 
    title: 'Caso Creado', 
    description: 'Radicado: RAD-2024-001', 
    icon: PlusIcon 
  },
  { 
    title: 'Estado Cambiado', 
    description: 'De: Abierto a En Progreso', 
    icon: ArrowRightIcon 
  },
  { 
    title: 'Escalado', 
    description: 'Asignado a: Equipo de Soporte', 
    icon: UsersIcon 
  },
  { 
    title: 'PDF Generado', 
    description: 'Documento: Reporte.pdf', 
    icon: DocumentTextIcon 
  },
  { 
    title: 'Envío Fallido', 
    description: 'Destinatario: cliente@email.com', 
    icon: XMarkIcon 
  },
  { 
    title: 'Correo Recibido', 
    description: 'Remitente: cliente@email.com', 
    icon: EnvelopeIcon 
  }
])

function applyFilters() {
  console.log('Applying filters:', filters.value)
}

function clearFilters() {
  filters.value = {
    actions: [],
    usuarioId: '',
    includeSystemActions: false,
    radicado: '',
    estado: '',
    result: 'todas'
  }
}
</script>

<style scoped>
/* Specific styling for the vertical connector alignment */
.border-l-2 {
  border-left-width: 2px;
}
</style>
