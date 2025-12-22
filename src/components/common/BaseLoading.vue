<template>
  <div :class="containerClasses">
    <svg
      :class="spinnerClasses"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <p v-if="text" :class="textClasses">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullscreen?: boolean
  color?: 'blue' | 'gray' | 'white'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullscreen: false,
  color: 'blue'
})

const containerClasses = computed(() => {
  const base = 'flex flex-col items-center justify-center gap-3'
  const fullscreenClass = props.fullscreen ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : ''

  return `${base} ${fullscreenClass}`
})

const spinnerClasses = computed(() => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  }

  const colors = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white'
  }

  return `animate-spin ${sizes[props.size]} ${colors[props.color]}`
})

const textClasses = computed(() => {
  const colors = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white'
  }

  return `text-sm font-medium ${colors[props.color]}`
})
</script>
