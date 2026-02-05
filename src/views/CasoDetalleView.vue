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
                <span
                  class="text-xs font-semibold uppercase tracking-wide text-gray-700 bg-gray-100 px-2 py-1 rounded"
                >
                  {{ caso.codigoEstado || 'SIN ESTADO' }}
                </span>
                <SemaforoIndicator :semaforo="caso.semaforo" />
              </div>
              <p class="text-sm text-gray-500 mt-1">{{ caso.titulo }}</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <BaseButton
              v-if="!caso.responsableId && !isCasoVencido"
              variant="outline"
              class="text-blue-600 border-blue-200 hover:bg-blue-50"
              @click="handleAssignMe"
            >
              Asignarme
            </BaseButton>
            <BaseButton
              variant="secondary"
              :disabled="isCasoVencido"
              :title="
                isCasoVencido
                  ? 'Este caso se encuentra vencido. No se permiten acciones operativas.'
                  : ''
              "
              @click="showModalPDF = true"
            >
              <DocumentArrowDownIcon class="h-4 w-4 mr-1" />
              PDF
            </BaseButton>
            <BaseButton
              variant="secondary"
              :disabled="isCasoVencido"
              :title="
                isCasoVencido
                  ? 'Este caso se encuentra vencido. No se permiten acciones operativas.'
                  : ''
              "
              @click="showModalEnvio = true"
            >
              <EnvelopeIcon class="h-4 w-4 mr-1" />
              Notificar
            </BaseButton>
            <BaseButton
              variant="danger"
              :disabled="isCasoVencido"
              :title="
                isCasoVencido
                  ? 'Este caso se encuentra vencido. No se permiten acciones operativas.'
                  : ''
              "
              @click="showModalEscalar = true"
            >
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
              'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
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

          <!-- Tab: Respuesta (RF-06) -->
          <template v-if="activeTab === 'respuesta'">
            <EditorRespuesta :caso-id="route.params.id as string" :is-vencido="isCasoVencido" />
          </template>

          <!-- Tab: PDF (RF-07) -->
          <template v-if="activeTab === 'pdf'">
            <GestionPDF
              :caso-id="route.params.id as string"
              :caso-numero="caso?.numero || ''"
              :is-vencido="isCasoVencido"
            />
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
                    <div
                      class="shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"
                    >
                      <PaperClipIcon class="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ adjunto.nombre }}</p>
                      <p class="text-xs text-gray-500">
                        {{ formatFileSize(adjunto.tamaño) }} - Subido
                        {{ formatRelativeTime(adjunto.fecha) }}
                      </p>
                    </div>
                  </div>
                  <BaseButton
                    size="sm"
                    variant="secondary"
                    @click="handleDownload(adjunto.id, adjunto.nombre)"
                  >
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
              <div v-if="escalamientos.length === 0">
                <BaseEmptyState
                  title="Sin escalamientos"
                  description="Este caso no ha sido escalado"
                />
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="escalamiento in escalamientos"
                  :key="escalamiento.id"
                  class="border rounded-lg p-4 border-gray-200 bg-gray-50"
                >
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500">{{
                        formatDateTime(escalamiento.fechaEscalamiento)
                      }}</span>
                    </div>
                  </div>
                  <!-- Observación combinada -->
                  <div class="text-sm text-gray-800 whitespace-pre-line mb-3">
                    {{ escalamiento.observacion }}
                  </div>

                  <div class="flex items-center gap-4 text-xs text-gray-500 border-t pt-2 mt-2">
                    <span
                      >De:
                      <strong>{{ escalamiento.de_usuario?.nombre || 'Desconocido' }}</strong></span
                    >
                    <span class="text-gray-300">|</span>
                    <span
                      >Para:
                      <strong>{{ escalamiento.a_usuario?.nombre || 'Desconocido' }}</strong></span
                    >
                  </div>
                </div>
              </div>
            </BaseCard>
          </template>
        </div>

        <!-- Sidebar con Timeline (siempre visible) -->
        <div>
          <CasoTimeline :eventos="historialEventos" />
        </div>
      </div>
    </div>

    <div v-else class="flex justify-center py-12">
      <BaseEmptyState
        title="Caso no encontrado"
        description="El caso que buscas no existe o no tienes acceso"
      >
        <template #action>
          <BaseButton @click="router.push('/casos')"> Volver a Casos </BaseButton>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
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
  ArrowUpCircleIcon,
  PencilSquareIcon,
  DocumentTextIcon,
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
import EditorRespuesta from '@/components/casos/EditorRespuesta.vue'
import GestionPDF from '@/components/casos/GestionPDF.vue'
import { useCasosStore } from '@/stores/casos'
import { adjuntosApi } from '@/api/adjuntos'
import { escalamientosApi } from '@/api/escalamientos'
import { auditoriaApi } from '@/api/auditoria'
import { formatFileSize, formatRelativeTime, formatDateTime, downloadFile } from '@/utils/helpers'
import { useToast } from '@/composables/useToast'
import type { Escalamiento, AuditoriaEvento, HistorialEvento, TipoEvento } from '@/types'

const route = useRoute()
const router = useRouter()
const casosStore = useCasosStore()
const toast = useToast()

const showModalEscalar = ref(false)
const showModalPDF = ref(false)
const showModalEnvio = ref(false)
const activeTab = ref('info')

const escalamientos = ref<Escalamiento[]>([])
const historialEventos = ref<HistorialEvento[]>([])

const caso = computed(() => casosStore.casoActual)

// Detectar si el caso está vencido (estado terminal operativo)
const isCasoVencido = computed(() => {
  return caso.value?.codigoEstado === 'VENCIDO'
})

const tabs = computed(() => [
  {
    id: 'info',
    name: 'Información',
    icon: InformationCircleIcon,
  },
  {
    id: 'respuesta',
    name: 'Respuesta',
    icon: PencilSquareIcon,
  },
  {
    id: 'pdf',
    name: 'PDF',
    icon: DocumentTextIcon,
  },
  {
    id: 'adjuntos',
    name: 'Adjuntos',
    icon: DocumentDuplicateIcon,
    count: caso.value?.adjuntos?.length || 0,
  },
  {
    id: 'escalamientos',
    name: 'Escalamientos',
    icon: ArrowUpCircleIcon,
    count: caso.value?.escalamientos?.length || 0,
  },
])

const pollingInterval = ref<number | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  await loadData(id)

  // Polling cada 30 segundos
  pollingInterval.value = window.setInterval(() => {
    loadData(id)
  }, 30000)
})

onUnmounted(() => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
  }
})

async function loadData(id: string) {
  await Promise.all([casosStore.obtener(id), fetchEscalamientos(id), fetchHistorial(id)])
}

async function fetchEscalamientos(casoId: string) {
  try {
    escalamientos.value = await escalamientosApi.listar(casoId)
  } catch (e) {
    console.error('Error fetching escalamientos', e)
  }
}

async function fetchHistorial(casoId: string) {
  try {
    const auditoriaEventos = await auditoriaApi.listarByCaso(casoId)
    historialEventos.value = auditoriaEventos.map(mapAuditoriaToHistorial)
  } catch (e) {
    console.error('Error fetching historial', e)
  }
}

function mapAuditoriaToHistorial(evento: AuditoriaEvento): HistorialEvento {
  // Mapeo de tipoAccionId a TipoEvento del frontend
  // IDs backend: 1=crear, 2=actualizar, 3=eliminar, 4=ESCAlAMIENTO, 5=LOGIN, 6=RECUPERAR, 7=ACT_ESCALAMIENTO
  const tipoMap: Record<number, TipoEvento> = {
    1: 'creacion',
    2: 'cambio_estado',
    3: 'cambio_estado',
    4: 'escalamiento',
    5: 'asignacion', // Login (no usado aqui habitualmente)
    6: 'cambio_estado',
    7: 'escalamiento',
  }
  return {
    id: evento.id,
    casoId: evento.casoId ? parseInt(evento.casoId) : 0,
    tipo: tipoMap[evento.tipoAccionId] || 'cambio_estado',
    descripcion: evento.tipo_accion?.descripcion || 'Evento',
    usuario: evento.usuario || {
      id: 0,
      nombre: 'Sistema',
      email: '',
      rol: 'admin',
      activo: true,
      createdAt: '',
      updatedAt: '',
    },
    fecha: evento.fechaEvento,
    metadata: evento.detalleJson ? JSON.parse(evento.detalleJson) : undefined,
  }
}

async function handleAssignMe() {
  const id = route.params.id as string
  await casosStore.asignarme(id)
  await loadData(id)
  toast.success('Te has asignado el caso exitosamente')
}

async function handleEscalado() {
  const id = route.params.id as string
  await loadData(id)
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
