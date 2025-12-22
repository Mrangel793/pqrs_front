<template>
  <AppLayout>
    <div v-if="casosStore.loading && !caso" class="flex justify-center py-12">
      <BaseLoading size="lg" text="Cargando caso..." />
    </div>

    <div v-else-if="caso" class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <BaseButton variant="ghost" @click="router.back()">
            <ArrowLeftIcon class="h-5 w-5" />
          </BaseButton>
          <h1 class="text-2xl font-bold text-gray-900">Caso {{ caso.numero }}</h1>
        </div>

        <div class="flex gap-2">
          <BaseButton variant="secondary" @click="showModalPDF = true">
            Generar PDF
          </BaseButton>
          <BaseButton variant="secondary" @click="showModalEnvio = true">
            Enviar Notificación
          </BaseButton>
          <BaseButton variant="danger" @click="showModalEscalar = true">
            Escalar Caso
          </BaseButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <CasoInfoPanel :caso="caso" />

          <BaseCard title="Adjuntos">
            <div v-if="caso.adjuntos.length === 0">
              <BaseEmptyState
                title="Sin adjuntos"
                description="Este caso no tiene archivos adjuntos"
              />
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="adjunto in caso.adjuntos"
                :key="adjunto.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <PaperClipIcon class="h-5 w-5 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ adjunto.nombre }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(adjunto.tamaño) }}</p>
                  </div>
                </div>
                <BaseButton size="sm" variant="ghost" @click="handleDownload(adjunto.id, adjunto.nombre)">
                  Descargar
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </div>

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
      :caso-id="parseInt(route.params.id as string)"
      @success="handleEscalado"
    />

    <ModalGenerarPDF
      v-model="showModalPDF"
      :caso-id="parseInt(route.params.id as string)"
      :caso-numero="caso?.numero || ''"
    />

    <ModalConfirmarEnvio
      v-model="showModalEnvio"
      :caso-id="parseInt(route.params.id as string)"
      :ciudadano-email="caso?.ciudadanoEmail || ''"
      @success="handleEnvioNotificacion"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon, PaperClipIcon } from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseLoading from '@/components/common/BaseLoading.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import CasoInfoPanel from '@/components/casos/CasoInfoPanel.vue'
import CasoTimeline from '@/components/casos/CasoTimeline.vue'
import ModalEscalar from '@/components/casos/ModalEscalar.vue'
import ModalGenerarPDF from '@/components/casos/ModalGenerarPDF.vue'
import ModalConfirmarEnvio from '@/components/casos/ModalConfirmarEnvio.vue'
import { useCasosStore } from '@/stores/casos'
import { adjuntosApi } from '@/api/adjuntos'
import { formatFileSize, downloadFile } from '@/utils/helpers'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const casosStore = useCasosStore()
const toast = useToast()

const showModalEscalar = ref(false)
const showModalPDF = ref(false)
const showModalEnvio = ref(false)

const caso = computed(() => casosStore.casoActual)

onMounted(async () => {
  const id = parseInt(route.params.id as string)
  await casosStore.obtener(id)
})

async function handleEscalado() {
  const id = parseInt(route.params.id as string)
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
