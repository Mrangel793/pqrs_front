<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :class="selectClasses"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectClasses = computed(() => {
  const base = 'block w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors'

  if (props.error) {
    return `${base} border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500`
  }

  if (props.disabled) {
    return `${base} border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed`
  }

  return `${base} border-gray-300 focus:border-blue-500 focus:ring-blue-500`
})
</script>
