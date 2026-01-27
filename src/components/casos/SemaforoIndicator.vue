<template>
  <div class="flex items-center gap-2">
    <div 
      class="h-3 w-3 rounded-full"
      :style="{ backgroundColor: color }"
      :title="label"
    ></div>
    <span v-if="showLabel" class="text-sm font-medium" :style="{ color: color }">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Semaforo } from '@/types'

interface Props {
  semaforo?: Semaforo | null
  // Keep legacy prop for compatibility but make optional
  estado?: string
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: false
})

const color = computed(() => {
  if (props.semaforo?.colorHex) {
    return props.semaforo.colorHex
  }
  return '#9ca3af' // gray-400 fallback
})

const label = computed(() => {
  if (props.semaforo?.descripcion) {
    return props.semaforo.descripcion
  }
  return 'Sin asignar'
})
</script>
