<template>
  <BaseCard title="Editor de Respuesta">
    <div class="space-y-4">
      <!-- Barra de estado -->
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-2">
          <span
            v-if="guardando"
            class="inline-flex items-center gap-1 text-blue-600"
          >
            <ArrowPathIcon class="h-4 w-4 animate-spin" />
            Guardando...
          </span>
          <span
            v-else-if="ultimaModificacion"
            class="text-gray-500"
          >
            Última modificación: {{ formatRelativeTime(ultimaModificacion) }}
            <span v-if="modificadoPor"> por {{ modificadoPor }}</span>
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span
            v-if="tieneCambiosSinGuardar"
            class="text-amber-600 text-xs"
          >
            Cambios sin guardar
          </span>
        </div>
      </div>

      <!-- Editor principal -->
      <div class="border rounded-lg overflow-hidden">
        <QuillEditor
          ref="editorRef"
          v-model:content="contenidoHtml"
          content-type="html"
          :options="editorOptions"
          class="min-h-[300px]"
          @update:content="onContentChange"
        />
      </div>

      <!-- Campo de texto adicional -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Texto Adicional (opcional)
        </label>
        <textarea
          v-model="textoAdicional"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Información adicional que no aparecerá en el cuerpo principal..."
          @input="onContentChange"
        ></textarea>
      </div>

      <!-- Botones de acción -->
      <div class="flex items-center justify-between pt-4 border-t">
        <div class="flex items-center gap-2">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />
          <BaseButton
            variant="secondary"
            size="sm"
            @click="fileInputRef?.click()"
            :disabled="subiendoImagen"
          >
            <PhotoIcon class="h-4 w-4 mr-1" />
            {{ subiendoImagen ? 'Subiendo...' : 'Insertar Imagen' }}
          </BaseButton>
        </div>

        <div class="flex items-center gap-2">
          <BaseButton
            variant="secondary"
            @click="cargarRespuesta"
            :disabled="cargando"
          >
            <ArrowPathIcon class="h-4 w-4 mr-1" />
            Recargar
          </BaseButton>
          <BaseButton
            variant="primary"
            @click="guardarBorrador"
            :disabled="guardando || !tieneCambiosSinGuardar"
          >
            <DocumentCheckIcon class="h-4 w-4 mr-1" />
            Guardar Borrador
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  ArrowPathIcon,
  PhotoIcon,
  DocumentCheckIcon
} from '@heroicons/vue/24/outline'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { respuestasApi } from '@/api/respuestas'
import { formatRelativeTime } from '@/utils/helpers'
import { useToast } from '@/composables/useToast'

interface Props {
  casoId: string | number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  saved: []
}>()

const toast = useToast()

// Estado del editor
const editorRef = ref<InstanceType<typeof QuillEditor> | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const contenidoHtml = ref('')
const textoAdicional = ref('')
const contenidoOriginal = ref('')
const textoAdicionalOriginal = ref('')

// Estado de carga y guardado
const cargando = ref(false)
const guardando = ref(false)
const subiendoImagen = ref(false)
const ultimaModificacion = ref<string | null>(null)
const modificadoPor = ref<string | null>(null)
const tieneCambiosSinGuardar = ref(false)

// Auto-guardado
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

// Configuración del editor Quill
const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, false] }],
      ['link', 'image'],
      ['clean']
    ]
  },
  placeholder: 'Escribe la respuesta al caso aquí...'
}

// Cargar respuesta existente
async function cargarRespuesta() {
  cargando.value = true
  try {
    const respuesta = await respuestasApi.obtener(props.casoId)
    contenidoHtml.value = respuesta.texto_html || ''
    textoAdicional.value = respuesta.texto_adicional || ''
    contenidoOriginal.value = respuesta.texto_html || ''
    textoAdicionalOriginal.value = respuesta.texto_adicional || ''
    ultimaModificacion.value = respuesta.ultima_modificacion
    modificadoPor.value = respuesta.modificado_por || null
    tieneCambiosSinGuardar.value = false
  } catch (error: any) {
    // Si no existe respuesta, es normal
    if (error.response?.status !== 404) {
      toast.error('Error al cargar la respuesta')
    }
  } finally {
    cargando.value = false
  }
}

// Guardar borrador
async function guardarBorrador() {
  guardando.value = true
  try {
    const respuesta = await respuestasApi.guardar(props.casoId, {
      texto_html: contenidoHtml.value,
      texto_adicional: textoAdicional.value || undefined
    })
    contenidoOriginal.value = contenidoHtml.value
    textoAdicionalOriginal.value = textoAdicional.value
    ultimaModificacion.value = respuesta.ultima_modificacion
    modificadoPor.value = respuesta.modificado_por || null
    tieneCambiosSinGuardar.value = false
    toast.success('Borrador guardado correctamente')
    emit('saved')
  } catch {
    toast.error('Error al guardar el borrador')
  } finally {
    guardando.value = false
  }
}

// Manejar cambios en el contenido
function onContentChange() {
  tieneCambiosSinGuardar.value =
    contenidoHtml.value !== contenidoOriginal.value ||
    textoAdicional.value !== textoAdicionalOriginal.value

  // Auto-guardado después de 30 segundos de inactividad
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  if (tieneCambiosSinGuardar.value) {
    autoSaveTimer = setTimeout(() => {
      guardarBorrador()
    }, 30000)
  }
}

// Subir imagen
async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Validar tamaño (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error('La imagen no debe superar los 5MB')
    return
  }

  subiendoImagen.value = true
  try {
    const resultado = await respuestasApi.subirImagen(props.casoId, file)

    // Insertar imagen en el editor
    const quill = editorRef.value?.getQuill()
    if (quill) {
      const range = quill.getSelection(true)
      quill.insertEmbed(range.index, 'image', resultado.url)
      quill.setSelection(range.index + 1)
    }

    toast.success('Imagen insertada correctamente')
  } catch {
    toast.error('Error al subir la imagen')
  } finally {
    subiendoImagen.value = false
    // Limpiar el input
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}

// Advertir al usuario si hay cambios sin guardar al salir
function beforeUnloadHandler(e: BeforeUnloadEvent) {
  if (tieneCambiosSinGuardar.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  cargarRespuesta()
  window.addEventListener('beforeunload', beforeUnloadHandler)
})

onBeforeUnmount(() => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  window.removeEventListener('beforeunload', beforeUnloadHandler)
})

// Exponer método para obtener contenido desde el padre
defineExpose({
  getContenido: () => ({
    texto_html: contenidoHtml.value,
    texto_adicional: textoAdicional.value
  }),
  tieneCambiosSinGuardar: () => tieneCambiosSinGuardar.value
})
</script>

<style>
.ql-container {
  font-size: 14px;
}

.ql-editor {
  min-height: 250px;
}

.ql-toolbar.ql-snow {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-color: #e5e7eb;
}

.ql-container.ql-snow {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-color: #e5e7eb;
}
</style>
