<template>
  <BaseBadge :color="color" :size="size">
    {{ formatEstadoCaso(estado) }}
  </BaseBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import { formatEstadoCaso, getEstadoCasoColor } from '@/utils/helpers'
import type { EstadoCaso } from '@/types'

interface Props {
  estado: EstadoCaso
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const color = computed(() => getEstadoCasoColor(props.estado) as any)
</script>
