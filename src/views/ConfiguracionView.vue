<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto space-y-12 py-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Configuración del Sistema</h1>

        <section class="space-y-6">
          <div class="space-y-1">
            <h2 class="text-lg font-semibold text-gray-900">Configuración de Correo</h2>
            <p class="text-sm text-blue-600">
              Configure los ajustes del buzón de correo para la ingesta de casos.
            </p>
          </div>

          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            Probar Conexión
            <ArrowRightIcon class="h-4 w-4" />
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl pt-4">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-900 mb-2">Buzón de correo:</label>
                <input
                  v-model="emailConfig.mailbox"
                  type="text"
                  class="w-full px-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-900 mb-2">Frecuencia de ingesta:</label>
                <div class="flex gap-4">
                  <input
                    v-model="emailConfig.frequencyValue"
                    type="text"
                    class="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-center"
                  />
                  <input
                    v-model="emailConfig.frequencyUnit"
                    type="text"
                    class="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-center"
                    placeholder="Minutos"
                  />
                </div>
              </div>

              <p class="text-sm font-medium text-blue-500 pt-2">
                Estado: Conectado
              </p>
            </div>
          </div>
        </section>
      </div>

      <section class="space-y-6">
        <div class="space-y-1">
          <h2 class="text-lg font-semibold text-gray-900">Umbrales de Semaforización</h2>
          <p class="text-sm text-blue-600">
            Defina los umbrales de tiempo para la priorización de casos.
          </p>
        </div>

        <div class="space-y-4 max-w-3xl">
          <div
            v-for="threshold in thresholds"
            :key="threshold.id"
            class="flex items-center justify-between p-2 rounded-xl group"
          >
            <div class="flex items-center gap-6">
              <div
                :class="[
                  'h-12 w-12 rounded-xl flex items-center justify-center shadow-sm',
                  threshold.bgColor
                ]"
              >
                <div :class="['h-4 w-4 rounded-full', threshold.dotColor]"></div>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-gray-900">{{ threshold.label }}</span>
                <span class="text-sm text-blue-500/80 font-medium">{{ threshold.range }}</span>
              </div>
            </div>
            <div class="text-right">
              <span class="text-sm font-medium text-gray-700">{{ threshold.priorityLabel }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

const emailConfig = ref({
  mailbox: '',
  frequencyValue: '10',
  frequencyUnit: 'Minutos'
})

const thresholds = ref([
  {
    id: 'verde',
    label: 'Verde',
    range: '> 48 horas',
    priorityLabel: 'Caso normal',
    bgColor: 'bg-green-50/50',
    dotColor: 'bg-green-500'
  },
  {
    id: 'amarillo',
    label: 'Amarillo',
    range: '48 - 24 horas',
    priorityLabel: 'Caso moderado',
    bgColor: 'bg-yellow-50/50',
    dotColor: 'bg-yellow-400'
  },
  {
    id: 'naranja',
    label: 'Naranja',
    range: '24 - 4 horas',
    priorityLabel: 'Caso urgente',
    bgColor: 'bg-orange-50/50',
    dotColor: 'bg-orange-500'
  },
  {
    id: 'rojo',
    label: 'Rojo',
    range: '< 4 horas',
    priorityLabel: 'Caso crítico',
    bgColor: 'bg-red-50/50',
    dotColor: 'bg-red-500'
  }
])
</script>

<style scoped>
/* Transiciones suaves para hover en elementos interactivos */
.group {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
