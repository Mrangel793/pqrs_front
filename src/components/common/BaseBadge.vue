<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'orange' | 'purple' | string
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'gray',
  size: 'md',
  dot: false
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center font-medium rounded-full'

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
    orange: 'bg-orange-100 text-orange-800',
    purple: 'bg-purple-100 text-purple-800'
  }

  return `${base} ${sizes[props.size]} ${colors[props.color] || colors.gray}`
})
</script>
