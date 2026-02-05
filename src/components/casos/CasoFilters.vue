<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Filtros</h3>
        <CasoSortSelect :model-value="sortBy" @update:model-value="handleSortChange" />
      </div>
    </template>

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
        <BaseButton variant="secondary" block @click="clearFilters"> Limpiar Filtros </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import CasoSortSelect from '@/components/casos/CasoSortSelect.vue'
import { debounce } from '@/utils/helpers'
import type { CasoFilters } from '@/types'

interface Props {
  modelValue: CasoFilters
  tipos: string[]
  estados: { value: number; label: string }[]
  prioridades: { value: number; label: string; color: string }[]
  sortBy: string
}

const props = withDefaults(defineProps<Props>(), {
  tipos: () => [],
  estados: () => [],
  prioridades: () => [],
  sortBy: 'mas_recientes',
})

const emit = defineEmits<{
  'update:modelValue': [value: CasoFilters]
  'update:sortBy': [value: string]
}>()

const localFilters = ref<CasoFilters>({ ...props.modelValue })

watch(
  () => props.modelValue,
  (newValue) => {
    localFilters.value = { ...newValue }
  },
  { deep: true },
)

const tipoOptions = computed(() => {
  if (props.tipos.length === 0) return []
  return props.tipos.map((t) => ({
    value: t,
    label: t.charAt(0).toUpperCase() + t.slice(1),
  }))
})

const estadoOptions = computed(() => props.estados)

const prioridadOptions = computed(() => {
  return props.prioridades.map((p) => ({
    value: p.value,
    label: p.label,
    color: p.color,
  }))
})

function emitFilters() {
  emit('update:modelValue', { ...localFilters.value })
}

const debouncedEmit = debounce(emitFilters, 500)

function handleSortChange(value: string) {
  emit('update:sortBy', value)
}

function clearFilters() {
  localFilters.value = {} as CasoFilters
  emitFilters()
}
</script>
