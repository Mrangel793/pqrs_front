<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Radicado
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Tipo
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Peticionario
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Responsable
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Días
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Semáforo
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading">
          <td colspan="6" class="px-6 py-12 text-center text-gray-500">
            <div class="flex items-center justify-center gap-2">
              <svg
                class="animate-spin h-5 w-5 text-blue-600"
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
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Cargando...</span>
            </div>
          </td>
        </tr>
        <tr v-else-if="casos.length === 0">
          <td colspan="6" class="px-6 py-12 text-center text-gray-500">
            {{ emptyMessage }}
          </td>
        </tr>
        <tr
          v-for="caso in casos"
          :key="caso.caso_id"
          class="hover:bg-gray-50 cursor-pointer transition-colors"
          @click="$emit('ver-caso', caso.caso_id)"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="text-sm font-medium text-blue-600">
              {{ caso.radicado }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="text-sm text-gray-900">
              {{ caso.tipo_tramite }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="text-sm text-gray-900">
              {{ caso.peticionario_nombre }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="text-sm text-gray-500">
              {{ caso.responsable_nombre || 'Sin asignar' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm">
              <span
                v-if="caso.es_vencido && caso.tiempo_vencido_humano"
                class="font-semibold text-red-600"
              >
                {{ caso.tiempo_vencido_humano }}
              </span>
              <span
                v-else-if="!caso.es_vencido && caso.tiempo_restante_humano"
                :class="getDiasClass(caso.dias_restantes)"
              >
                {{ caso.tiempo_restante_humano }}
              </span>
              <!-- Fallback a lógica anterior si no hay campos nuevos -->
              <span v-else-if="caso.es_vencido" class="font-semibold text-red-600">
                {{ Math.abs(caso.dias_restantes) }} días vencido
              </span>
              <span v-else :class="getDiasClass(caso.dias_restantes)">
                {{ caso.dias_restantes }} días restantes
              </span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :style="{
                backgroundColor: `${caso.color_hex}20`,
                color: caso.color_hex,
              }"
            >
              <span
                class="w-2 h-2 rounded-full mr-1.5"
                :style="{ backgroundColor: caso.color_hex }"
              />
              {{ caso.semaforo_actual_codigo }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { AlertaCasoItem } from '@/types'

defineProps<{
  casos: AlertaCasoItem[]
  loading?: boolean
  emptyMessage?: string
}>()

defineEmits<{
  (e: 'ver-caso', id: string): void
}>()

function getDiasClass(dias: number): string {
  if (dias <= 2) return 'font-semibold text-red-600'
  if (dias <= 5) return 'font-semibold text-orange-600'
  return 'text-gray-600'
}
</script>
