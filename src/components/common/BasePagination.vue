<template>
  <div class="flex items-center justify-between px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <BaseButton
        variant="secondary"
        size="sm"
        :disabled="!hasPrevious"
        @click="$emit('previous')"
      >
        Anterior
      </BaseButton>
      <BaseButton
        variant="secondary"
        size="sm"
        :disabled="!hasNext"
        @click="$emit('next')"
      >
        Siguiente
      </BaseButton>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Mostrando
          <span class="font-medium">{{ from }}</span>
          a
          <span class="font-medium">{{ to }}</span>
          de
          <span class="font-medium">{{ total }}</span>
          resultados
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            type="button"
            :disabled="!hasPrevious"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="$emit('previous')"
          >
            <span class="sr-only">Anterior</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>

          <button
            v-for="page in pages"
            :key="page"
            type="button"
            :class="[
              'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0',
              page === currentPage
                ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                : 'text-gray-900 hover:bg-gray-50'
            ]"
            @click="$emit('goto', page)"
          >
            {{ page }}
          </button>

          <button
            type="button"
            :disabled="!hasNext"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="$emit('next')"
          >
            <span class="sr-only">Siguiente</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from './BaseButton.vue'

interface Props {
  currentPage: number
  totalPages: number
  total: number
  pageSize: number
}

const props = defineProps<Props>()

defineEmits<{
  previous: []
  next: []
  goto: [page: number]
}>()

const hasPrevious = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.currentPage < props.totalPages)

const from = computed(() => {
  if (props.total === 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const to = computed(() => {
  const end = props.currentPage * props.pageSize
  return end > props.total ? props.total : end
})

const pages = computed(() => {
  const maxPages = 7
  const half = Math.floor(maxPages / 2)

  let start = Math.max(1, props.currentPage - half)
  const end = Math.min(props.totalPages, start + maxPages - 1)

  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>
