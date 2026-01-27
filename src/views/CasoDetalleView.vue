<template>
  <AppLayout>
    <div v-if="casosStore.loading && !caso" class="flex justify-center py-12">
      <BaseLoading size="lg" text="Cargando caso..." />
    </div>

    <div v-else-if="caso" class="space-y-6">
      <!-- Header con información clave -->
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-4">
            <BaseButton variant="ghost" @click="router.back()">
              <ArrowLeftIcon class="h-5 w-5" />
            </BaseButton>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-gray-900">Caso {{ caso.numero }}</h1>
                <span class="text-xs font-semibold uppercase tracking-wide text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  {{ caso.codigoEstado || 'SIN ESTADO' }}
                </span>
                <SemaforoIndicator :semaforo="caso.semaforo" />
              </div>
              <p class="text-sm text-gray-500 mt-1">{{ caso.titulo }}</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <BaseButton variant="secondary" @click="handleEdit">
              <PencilIcon class="h-4 w-4 mr-1" />
              Editar
            </BaseButton>
            <BaseButton variant="secondary" @click="showModalPDF = true">
              <DocumentArrowDownIcon class="h-4 w-4 mr-1" />
              PDF
            </BaseButton>
            <BaseButton variant="secondary" @click="showModalEnvio = true">
              <EnvelopeIcon class="h-4 w-4 mr-1" />
              Notificar
            </BaseButton>
            <BaseButton variant="danger" @click="showModalEscalar = true">
              <ExclamationTriangleIcon class="h-4 w-4 mr-1" />
              Escalar
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Tabs de navegación -->
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2'
            ]"
          >
            <component :is="tab.icon" class="h-4 w-4" />
            {{ tab.name }}
            <span
              v-if="tab.count !== undefined && tab.count > 0"
              class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
            >
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Contenido según tab activo -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <!-- Tab: Información -->
          <template v-if="activeTab === 'info'">
            <CasoInfoPanel :caso="caso" />
          </template>

          <!-- Tab: Adjuntos -->
          <template v-if="activeTab === 'adjuntos'">
            <BaseCard title="Archivos Adjuntos">
              <div v-if="!caso.adjuntos || caso.adjuntos.length === 0">
                <BaseEmptyState
                  title="Sin adjuntos"
                  description="Este caso no tiene archivos adjuntos"
                />
              </div>
              <div v-else class="space-y-2">
                <div
                  v-for="adjunto in caso.adjuntos"
                  :key="adjunto.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <PaperClipIcon class="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ adjunto.nombre }}</p>
                      <p class="text-xs text-gray-500">
                        {{ formatFileSize(adjunto.tamaño) }} - Subido {{ formatRelativeTime(adjunto.fecha) }}
                      </p>
                    </div>
                  </div>
                  <BaseButton size="sm" variant="secondary" @click="handleDownload(adjunto.id, adjunto.nombre)">
                    <ArrowDownTrayIcon class="h-4 w-4 mr-1" />
                    Descargar
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </template>

          <!-- Tab: Escalamientos -->
          <template v-if="activeTab === 'escalamientos'">
            <BaseCard title="Historial de Escalamientos">
              <div v-if="!caso.escalamientos || caso.escalamientos.length === 0">
                <BaseEmptyState
                  title="Sin escalamientos"
                  description="Este caso no ha sido escalado"
                />
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="escalamiento in caso.escalamientos"
                  :key="escalamiento.id"
                  class="border rounded-lg p-4"
                  :class="escalamiento.resuelto ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
                >
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="escalamiento.resuelto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      >
                        Nivel {{ escalamiento.nivel }}
                      </span>
                      <span class="text-xs text-gray-500">{{ formatDateTime(escalamiento.fecha) }}</span>
                    </div>
                    <span
                      class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                      :class="escalamiento.resuelto ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
                    >
                      {{ escalamiento.resuelto ? 'Resuelto' : 'Pendiente' }}
                    </span>
                  </div>
                  <h4 class="font-medium text-gray-900 mb-1">{{ escalamiento.motivo }}</h4>
                  <p class="text-sm text-gray-600 mb-3">{{ escalamiento.descripcion }}</p>
                  <div class="flex items-center gap-4 text-xs text-gray-500">
                    <span>Escalado por: <strong>{{ escalamiento.escaladoPor?.nombre || 'Sistema' }}</strong></span>
                    <span v-if="escalamiento.escaladoA">
                      Asignado a: <strong>{{ escalamiento.escaladoA.nombre }}</strong>
                    </span>
                  </div>
                  <div v-if="escalamiento.resuelto && escalamiento.fechaResolucion" class="mt-2 pt-2 border-t text-xs text-gray-500">
                    Resuelto el: {{ formatDateTime(escalamiento.fechaResolucion) }}
                  </div>
                </div>
              </div>
            </BaseCard>
          </template>
        </div>

        <!-- Sidebar con Timeline (siempre visible) -->
        <div>
          <CasoTimeline :eventos="caso.historial" />
        </div>
      </div>
    </div>

    <div v-else class="flex justify-center py-12">
      <BaseEmptyState
        title="Caso no encontrado"
        description="El caso que buscas no existe o no tienes acceso"
      >
        <template #action>
          <BaseButton @click="router.push('/casos')">
            Volver a Casos
          </BaseButton>
        </template>
      </BaseEmptyState>
    </div>

    <ModalEscalar
      v-model="showModalEscalar"
      :caso-id="route.params.id as string"
      @success="handleEscalado"
    />

    <ModalGenerarPDF
      v-model="showModalPDF"
      :caso-id="route.params.id as string"
      :caso-numero="caso?.numero || ''"
    />

    <ModalConfirmarEnvio
      v-model="showModalEnvio"
      :caso-id="route.params.id as string"
      :ciudadano-email="caso?.ciudadanoEmail || ''"
      @success="handleEnvioNotificacion"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  PaperClipIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon,
  DocumentDuplicateIcon,
  ArrowUpCircleIcon
} from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseLoading from '@/components/common/BaseLoading.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import CasoInfoPanel from '@/components/casos/CasoInfoPanel.vue'
import CasoTimeline from '@/components/casos/CasoTimeline.vue'
import EstadoBadge from '@/components/casos/EstadoBadge.vue'
import SemaforoIndicator from '@/components/casos/SemaforoIndicator.vue'
import ModalEscalar from '@/components/casos/ModalEscalar.vue'
import ModalGenerarPDF from '@/components/casos/ModalGenerarPDF.vue'
import ModalConfirmarEnvio from '@/components/casos/ModalConfirmarEnvio.vue'
import { useCasosStore } from '@/stores/casos'
import { adjuntosApi } from '@/api/adjuntos'
import { formatFileSize, formatRelativeTime, formatDateTime, downloadFile } from '@/utils/helpers'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const casosStore = useCasosStore()
const toast = useToast()

const showModalEscalar = ref(false)
const showModalPDF = ref(false)
const showModalEnvio = ref(false)
const activeTab = ref('info')

const caso = computed(() => casosStore.casoActual)

const tabs = computed(() => [
  {
    id: 'info',
    name: 'Información',
    icon: InformationCircleIcon
  },
  {
    id: 'adjuntos',
    name: 'Adjuntos',
    icon: DocumentDuplicateIcon,
    count: caso.value?.adjuntos?.length || 0
  },
  {
    id: 'escalamientos',
    name: 'Escalamientos',
    icon: ArrowUpCircleIcon,
    count: caso.value?.escalamientos?.length || 0
  }
])

onMounted(async () => {
  const id = route.params.id as string
  await casosStore.obtener(id)
})

function handleEdit() {
  const id = route.params.id as string
  router.push(`/casos/${id}/editar`)
}

async function handleEscalado() {
  const id = route.params.id as string
  await casosStore.obtener(id)
  toast.success('El historial se ha actualizado')
}

function handleEnvioNotificacion() {
  toast.success('La notificación se ha registrado')
}

async function handleDownload(id: number, nombre: string) {
  try {
    const blob = await adjuntosApi.descargar(id)
    downloadFile(blob, nombre)
  } catch (error) {
    toast.error('Error al descargar el archivo')
  }
}
</script>
