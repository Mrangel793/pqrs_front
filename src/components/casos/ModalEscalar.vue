<template>
  <BaseModal v-model="isOpen" title="Escalar Caso" size="md">
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <BaseInput
          v-model="form.motivo"
          label="Motivo"
          placeholder="Ingrese el motivo del escalamiento"
          required
          :error="errors.motivo"
        />

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.descripcion"
            rows="4"
            class="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describa detalladamente la razón del escalamiento"
            required
          ></textarea>
          <p v-if="errors.descripcion" class="mt-1 text-sm text-red-600">
            {{ errors.descripcion }}
          </p>
        </div>

        <BaseSelect
          v-model="form.escaladoAId"
          label="Escalar a (opcional)"
          placeholder="Seleccione un supervisor"
          :options="supervisorOptions"
          :error="errors.escaladoAId"
        />
      </div>
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="isOpen = false">
        Cancelar
      </BaseButton>
      <BaseButton variant="danger" :loading="loading" @click="handleSubmit">
        Escalar Caso
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { useToast } from '@/composables/useToast'
import { escalamientosApi } from '@/api/escalamientos'
import { useUsuariosStore } from '@/stores/usuarios'
import type { EscalamientoFormData } from '@/types'

interface Props {
  modelValue: boolean
  casoId: number | string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  success: []
}>()

const usuariosStore = useUsuariosStore()
const toast = useToast()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref<Omit<EscalamientoFormData, 'casoId'>>({
  motivo: '',
  descripcion: '',
  escaladoAId: undefined
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)

const supervisorOptions = computed(() => {
  return usuariosStore.usuarios
    .filter((u) => u.rol === 'supervisor' || u.rol === 'admin')
    .map((u) => ({
      value: u.id,
      label: u.nombre
    }))
})

watch(isOpen, async (newValue) => {
  if (newValue) {
    form.value = { motivo: '', descripcion: '', escaladoAId: undefined }
    errors.value = {}
    await usuariosStore.listar()
  }
})

async function handleSubmit() {
  errors.value = {}

  if (!form.value.motivo) {
    errors.value.motivo = 'El motivo es requerido'
    return
  }

  if (!form.value.descripcion) {
    errors.value.descripcion = 'La descripción es requerida'
    return
  }

  try {
    loading.value = true
    await escalamientosApi.crear({
      casoId: props.casoId,
      ...form.value
    })
    toast.success('Caso escalado exitosamente')
    isOpen.value = false
    emit('success')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error al escalar caso')
  } finally {
    loading.value = false
  }
}
</script>
