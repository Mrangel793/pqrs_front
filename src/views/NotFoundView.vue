<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-300">404</h1>
      <h2 class="text-2xl font-semibold text-gray-900 mt-4">Página no encontrada</h2>
      <p class="text-gray-600 mt-2 mb-8">
        La página que buscas no existe o ha sido movida
      </p>
      <BaseButton @click="router.push('/dashboard')">
        Volver al Dashboard
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
</script>
