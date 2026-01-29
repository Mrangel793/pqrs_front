<template>
  <div class="space-y-6">
    <!-- Card para generar nuevo PDF -->
    <BaseCard title="Generar PDF">
      <div class="space-y-4">
        <!-- Selector de plantilla -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Plantilla
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              v-for="plantilla in plantillas"
              :key="plantilla.value"
              @click="plantillaSeleccionada = plantilla.value"
              :class="[
                'relative flex flex-col items-center p-4 border-2 rounded-lg transition-all',
                plantillaSeleccionada === plantilla.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <component
                :is="plantilla.icon"
                :class="[
                  'h-8 w-8 mb-2',
                  plantillaSeleccionada === plantilla.value
                    ? 'text-blue-600'
                    : 'text-gray-400'
                ]"
              />
              <span class="text-sm font-medium text-gray-900">
                {{ plantilla.label }}
              </span>
              <span class="text-xs text-gray-500 text-center mt-1">
                {{ plantilla.descripcion }}
              </span>
            </button>
          </div>
        </div>

        <!-- Texto adicional opcional -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Texto Adicional (opcional)
          </label>
          <textarea
            v-model="textoAdicional"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
            placeholder="Notas adicionales para incluir en el PDF..."
          ></textarea>
        </div>

        <!-- Botón de generar -->
        <div class="flex justify-end">
          <BaseButton
            variant="primary"
            @click="generarPDF"
            :disabled="generando || !plantillaSeleccionada"
          >
            <template v-if="generando">
              <ArrowPathIcon class="h-4 w-4 mr-2 animate-spin" />
              Generando...
            </template>
            <template v-else>
              <DocumentArrowDownIcon class="h-4 w-4 mr-2" />
              Generar PDF
            </template>
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Card para historial de versiones -->
    <BaseCard title="Historial de Versiones">
      <div v-if="cargandoVersiones" class="flex justify-center py-8">
        <BaseLoading text="Cargando versiones..." />
      </div>

      <div v-else-if="versiones.length === 0">
        <BaseEmptyState
          title="Sin versiones"
          description="No hay PDFs generados para este caso"
        />
      </div>

      <div v-else class="divide-y">
        <div
          v-for="version in versiones"
          :key="version.version"
          class="py-4 first:pt-0 last:pb-0"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <DocumentIcon class="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-900">
                    Versión {{ version.version }}
                  </span>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    :class="getPlantillaBadgeClass(version.tipo_plantilla)"
                  >
                    {{ getPlantillaLabel(version.tipo_plantilla) }}
                  </span>
                </div>
                <p class="text-sm text-gray-500">
                  {{ formatDateTime(version.fecha_generacion) }}
                  <span v-if="version.generado_por">
                    por {{ version.generado_por }}
                  </span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <BaseButton
                size="sm"
                variant="ghost"
                @click="previewPDF(version.version)"
                :disabled="previewing === version.version"
              >
                <EyeIcon class="h-4 w-4" />
              </BaseButton>
              <BaseButton
                size="sm"
                variant="secondary"
                @click="descargarPDF(version.version)"
                :disabled="descargando === version.version"
              >
                <ArrowDownTrayIcon class="h-4 w-4 mr-1" />
                Descargar
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>

    <!-- Modal de Preview -->
    <TransitionRoot appear :show="showPreview" as="template">
      <Dialog as="div" @close="showPreview = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <DialogTitle class="text-lg font-medium text-gray-900 flex items-center justify-between mb-4">
                  <span>Vista Previa - Versión {{ versionPreview }}</span>
                  <button
                    @click="showPreview = false"
                    class="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </DialogTitle>

                <div class="bg-gray-100 rounded-lg p-2 h-[70vh]">
                  <iframe
                    v-if="previewUrl"
                    :src="previewUrl"
                    class="w-full h-full rounded"
                    title="Vista previa PDF"
                  />
                  <div v-else class="flex items-center justify-center h-full">
                    <BaseLoading text="Cargando preview..." />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import {
  DocumentArrowDownIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  EyeIcon,
  XMarkIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseLoading from '@/components/common/BaseLoading.vue'
import BaseEmptyState from '@/components/common/BaseEmptyState.vue'
import { pdfApi } from '@/api/pdf'
import { formatDateTime, downloadFile } from '@/utils/helpers'
import { useToast } from '@/composables/useToast'
import type { PDFVersionInfo, TipoPlantillaPDF } from '@/types'

interface Props {
  casoId: string | number
  casoNumero: string
}

const props = defineProps<Props>()

const toast = useToast()

// Estado
const plantillaSeleccionada = ref<TipoPlantillaPDF | null>(null)
const textoAdicional = ref('')
const versiones = ref<PDFVersionInfo[]>([])
const cargandoVersiones = ref(false)
const generando = ref(false)
const descargando = ref<number | null>(null)
const previewing = ref<number | null>(null)
const showPreview = ref(false)
const previewUrl = ref<string | null>(null)
const versionPreview = ref<number | null>(null)

// Plantillas disponibles
const plantillas = [
  {
    value: 'FACTURA' as TipoPlantillaPDF,
    label: 'Factura',
    descripcion: 'Documento de facturación',
    icon: ReceiptPercentIcon
  },
  {
    value: 'POSTILLA' as TipoPlantillaPDF,
    label: 'Postilla/Apostilla',
    descripcion: 'Certificación de documento',
    icon: DocumentTextIcon
  },
  {
    value: 'FALLA' as TipoPlantillaPDF,
    label: 'Falla/No Disponibilidad',
    descripcion: 'Reporte de indisponibilidad',
    icon: ExclamationCircleIcon
  }
]

// Cargar versiones
async function cargarVersiones() {
  cargandoVersiones.value = true
  try {
    versiones.value = await pdfApi.listarVersiones(props.casoId)
  } catch {
    toast.error('Error al cargar las versiones')
  } finally {
    cargandoVersiones.value = false
  }
}

// Generar nuevo PDF
async function generarPDF() {
  if (!plantillaSeleccionada.value) return

  generando.value = true
  try {
    const resultado = await pdfApi.generar(
      props.casoId,
      plantillaSeleccionada.value,
      textoAdicional.value || undefined
    )
    toast.success(`PDF versión ${resultado.version} generado correctamente`)
    textoAdicional.value = ''
    // Recargar lista de versiones
    await cargarVersiones()
  } catch {
    toast.error('Error al generar el PDF')
  } finally {
    generando.value = false
  }
}

// Descargar PDF
async function descargarPDF(version: number) {
  descargando.value = version
  try {
    const blob = await pdfApi.descargarVersion(props.casoId, version)
    downloadFile(blob, `${props.casoNumero}_v${version}.pdf`)
    toast.success('PDF descargado correctamente')
  } catch {
    toast.error('Error al descargar el PDF')
  } finally {
    descargando.value = null
  }
}

// Ver preview del PDF
async function previewPDF(version: number) {
  previewing.value = version
  versionPreview.value = version
  showPreview.value = true
  previewUrl.value = null

  try {
    const blob = await pdfApi.previewVersion(props.casoId, version)
    previewUrl.value = URL.createObjectURL(blob)
  } catch {
    toast.error('Error al cargar el preview')
    showPreview.value = false
  } finally {
    previewing.value = null
  }
}

// Helpers para plantillas
function getPlantillaLabel(tipo: TipoPlantillaPDF): string {
  const plantilla = plantillas.find(p => p.value === tipo)
  return plantilla?.label || tipo
}

function getPlantillaBadgeClass(tipo: TipoPlantillaPDF): string {
  const classes: Record<TipoPlantillaPDF, string> = {
    FACTURA: 'bg-green-100 text-green-800',
    POSTILLA: 'bg-blue-100 text-blue-800',
    FALLA: 'bg-red-100 text-red-800'
  }
  return classes[tipo] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  cargarVersiones()
})
</script>
