<template>
  <div class="flex items-center gap-2">
    <div :class="['h-3 w-3 rounded-full', colorClass]"></div>
    <span v-if="showLabel" class="text-sm font-medium" :class="textClass">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EstadoSemaforo } from '@/types'

interface Props {
  estado: EstadoSemaforo
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: false
})

const colorClass = computed(() => {
  const colors = {
    verde: 'bg-green-500',
    amarillo: 'bg-yellow-500',
    rojo: 'bg-red-500'
  }
  return colors[props.estado]
})

const textClass = computed(() => {
  const colors = {
    verde: 'text-green-700',
    amarillo: 'text-yellow-700',
    rojo: 'text-red-700'
  }
  return colors[props.estado]
})

const label = computed(() => {
  const labels = {
    verde: 'A tiempo',
    amarillo: 'Por vencer',
    rojo: 'Vencido'
  }
  return labels[props.estado]
})
</script>
