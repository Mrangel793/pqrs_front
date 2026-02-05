<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-600 whitespace-nowrap">Ordenar:</span>
    <select
      :value="modelValue"
      @change="handleChange"
      class="text-sm rounded-md border-gray-300 py-1.5 px-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer bg-white"
    >
      <option v-for="option in sortOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface SortOption {
  value: string
  label: string
}

interface Props {
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const sortOptions: SortOption[] = [
  { value: 'proximos_vencer', label: 'Próximos a vencer' },
  { value: 'vencidos_primero', label: 'Vencidos primero' },
  { value: 'mas_recientes', label: 'Más recientes' },
  { value: 'mas_antiguos', label: 'Más antiguos' },
  { value: 'mayor_prioridad', label: 'Mayor prioridad' },
  { value: 'menor_prioridad', label: 'Menor prioridad' },
]

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
