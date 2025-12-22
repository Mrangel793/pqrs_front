<template>
  <BaseModal v-model="isOpen" size="sm">
    <div class="text-center">
      <div :class="iconClasses" class="mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center">
        <svg
          class="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ options.title }}</h3>
      <p class="text-sm text-gray-500 mb-6">{{ options.message }}</p>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="handleCancel">
        {{ options.cancelText }}
      </BaseButton>
      <BaseButton :variant="confirmVariant" @click="handleConfirm">
        {{ options.confirmText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

const { isOpen, options, handleConfirm, handleCancel } = useConfirm()

const iconClasses = computed(() => {
  const classes = {
    danger: 'bg-red-100 text-red-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-blue-100 text-blue-600'
  }

  return classes[options.value.type || 'info']
})

const confirmVariant = computed(() => {
  const variants = {
    danger: 'danger' as const,
    warning: 'warning' as const,
    info: 'primary' as const
  }

  return variants[options.value.type || 'info']
})
</script>
