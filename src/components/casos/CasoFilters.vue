<template>
  <BaseCard title="Filtros">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <BaseInput
        v-model="localFilters.busqueda"
        label="Buscar"
        placeholder="Número, título, ciudadano..."
        @update:model-value="debouncedEmit"
      />

      <BaseSelect
        v-model="localFilters.tipo"
        label="Tipo"
        placeholder="Todos los tipos"
        :options="tipoOptions"
        @update:model-value="emitFilters"
      />

      <BaseSelect
        v-model="localFilters.estado"
        label="Estado"
        placeholder="Todos los estados"
        :options="estadoOptions"
        @update:model-value="emitFilters"
      />

      <BaseSelect
        v-model="localFilters.prioridad"
        label="Prioridad"
        placeholder="Todas las prioridades"
        :options="prioridadOptions"
        @update:model-value="emitFilters"
      />

      <BaseSelect
        v-model="localFilters.semaforoEstado"
        label="Semáforo"
        placeholder="Todos"
        :options="semaforoOptions"
        @update:model-value="emitFilters"
      />

      <BaseInput
        v-model="localFilters.fechaDesde"
        type="date"
        label="Desde"
        @update:model-value="emitFilters"
      />

      <BaseInput
        v-model="localFilters.fechaHasta"
        type="date"
        label="Hasta"
        @update:model-value="emitFilters"
      />

      <div class="flex items-end">
        <BaseButton variant="secondary" block @click="clearFilters">
          Limpiar Filtros
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { debounce } from '@/utils/helpers'
import type { CasoFilters } from '@/types'

interface Props {
  modelValue: CasoFilters
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: CasoFilters]
}>()

const localFilters = ref<CasoFilters>({ ...props.modelValue })

watch(() => props.modelValue, (newValue) => {
  localFilters.value = { ...newValue }
}, { deep: true })

const tipoOptions = [
  { value: 'peticion', label: 'Petición' },
  { value: 'queja', label: 'Queja' },
  { value: 'reclamo', label: 'Reclamo' },
  { value: 'sugerencia', label: 'Sugerencia' }
]

const estadoOptions = [
  { value: 'abierto', label: 'Abierto' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'escalado', label: 'Escalado' },
  { value: 'cerrado', label: 'Cerrado' },
  { value: 'pendiente', label: 'Pendiente' }
]

const prioridadOptions = [
  { value: 'baja', label: 'Baja' },
  { value: 'media', label: 'Media' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Crítica' }
]

const semaforoOptions = [
  { value: 'verde', label: 'Verde' },
  { value: 'amarillo', label: 'Amarillo' },
  { value: 'rojo', label: 'Rojo' }
]

function emitFilters() {
  emit('update:modelValue', { ...localFilters.value })
}

const debouncedEmit = debounce(emitFilters, 500)

function clearFilters() {
  localFilters.value = {} as CasoFilters
  emitFilters()
}
</script>
