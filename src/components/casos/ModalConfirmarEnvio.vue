<template>
  <BaseModal v-model="isOpen" title="Enviar Notificación" size="md">
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <BaseInput
          v-model="form.asunto"
          label="Asunto"
          placeholder="Asunto del correo"
          required
          :error="errors.asunto"
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Mensaje <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.mensaje"
            rows="5"
            class="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Contenido del mensaje"
            required
          ></textarea>
          <p v-if="errors.mensaje" class="mt-1 text-sm text-red-600">
            {{ errors.mensaje }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Destinatarios
          </label>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                v-model="incluirCiudadano"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label class="ml-2 text-sm text-gray-700">
                Ciudadano ({{ ciudadanoEmail }})
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="isOpen = false">
        Cancelar
      </BaseButton>
      <BaseButton variant="primary" :loading="loading" @click="handleSubmit">
        Enviar Notificación
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import { useToast } from '@/composables/useToast'
import { correoApi } from '@/api/correo'

interface Props {
  modelValue: boolean
  casoId: number
  ciudadanoEmail: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const toast = useToast()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref({
  asunto: '',
  mensaje: ''
})

const incluirCiudadano = ref(true)
const errors = ref<Record<string, string>>({})
const loading = ref(false)

watch(isOpen, (newValue) => {
  if (newValue) {
    form.value = { asunto: '', mensaje: '' }
    incluirCiudadano.value = true
    errors.value = {}
  }
})

async function handleSubmit() {
  errors.value = {}

  if (!form.value.asunto) {
    errors.value.asunto = 'El asunto es requerido'
    return
  }

  if (!form.value.mensaje) {
    errors.value.mensaje = 'El mensaje es requerido'
    return
  }

  const destinatarios = incluirCiudadano.value ? [props.ciudadanoEmail] : []

  if (destinatarios.length === 0) {
    toast.warning('Debe seleccionar al menos un destinatario')
    return
  }

  try {
    loading.value = true
    await correoApi.enviarNotificacion(props.casoId, {
      destinatarios,
      asunto: form.value.asunto,
      mensaje: form.value.mensaje
    })
    toast.success('Notificación enviada exitosamente')
    isOpen.value = false
    emit('success')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error al enviar notificación')
  } finally {
    loading.value = false
  }
}
</script>
