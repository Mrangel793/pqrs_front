<template>
  <AppLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Configuración</h1>

      <BaseCard title="Configuración del Sistema">
        <p class="text-gray-600">
          Esta vista está en desarrollo. Aquí se configurarán los parámetros del sistema como
          tiempos de semáforo, escalamientos automáticos, notificaciones, etc.
        </p>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
</script>
