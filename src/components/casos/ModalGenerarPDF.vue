<template>
  <BaseModal v-model="isOpen" title="Generar PDF" size="sm">
    <div class="text-center py-4">
      <p class="text-gray-700 mb-4">
        ¿Desea generar un PDF con la información completa del caso?
      </p>
      <div class="flex items-center justify-center gap-2 text-sm text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="isOpen = false">
        Cancelar
      </BaseButton>
      <BaseButton variant="primary" :loading="loading" @click="handleGenerate">
        Generar PDF
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useDownload } from '@/composables/useDownload'
import { pdfApi } from '@/api/pdf'

interface Props {
  modelValue: boolean
  casoId: number | string
  casoNumero: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { download, isDownloading: loading } = useDownload()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

async function handleGenerate() {
  const success = await download(
    () => pdfApi.generarCaso(props.casoId),
    `caso_${props.casoNumero}.pdf`
  )

  if (success) {
    isOpen.value = false
  }
}
</script>
