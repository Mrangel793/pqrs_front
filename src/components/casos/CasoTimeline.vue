<template>
  <BaseCard title="Historial">
    <div class="flow-root">
      <ul role="list" class="-mb-8">
        <li v-for="(evento, index) in eventos" :key="evento.id">
          <div class="relative pb-8">
            <span
              v-if="index !== eventos.length - 1"
              class="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
              aria-hidden="true"
            />
            <div class="relative flex space-x-3">
              <div>
                <span
                  :class="[
                    'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                    getEventColor(evento.tipo)
                  ]"
                >
                  <component :is="getEventIcon(evento.tipo)" class="h-5 w-5 text-white" />
                </span>
              </div>
              <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                <div>
                  <p class="text-sm text-gray-900">
                    {{ evento.descripcion }}
                  </p>
                  <p class="mt-0.5 text-xs text-gray-500">
                    Por {{ evento.usuario.nombre }}
                  </p>
                </div>
                <div class="whitespace-nowrap text-right text-xs text-gray-500">
                  {{ formatRelativeTime(evento.fecha) }}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import {
  PlusCircleIcon,
  UserPlusIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftIcon,
  PaperClipIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/solid'
import BaseCard from '@/components/common/BaseCard.vue'
import { formatRelativeTime } from '@/utils/helpers'
import type { HistorialEvento, TipoEvento } from '@/types'

interface Props {
  eventos: HistorialEvento[]
}

defineProps<Props>()

function getEventColor(tipo: TipoEvento): string {
  const colors = {
    creacion: 'bg-blue-500',
    asignacion: 'bg-green-500',
    cambio_estado: 'bg-yellow-500',
    cambio_prioridad: 'bg-orange-500',
    escalamiento: 'bg-red-500',
    comentario: 'bg-purple-500',
    adjunto: 'bg-gray-500',
    resolucion: 'bg-green-600'
  }
  return colors[tipo] || 'bg-gray-500'
}

function getEventIcon(tipo: TipoEvento) {
  const icons = {
    creacion: PlusCircleIcon,
    asignacion: UserPlusIcon,
    cambio_estado: ArrowPathIcon,
    cambio_prioridad: ExclamationTriangleIcon,
    escalamiento: ExclamationTriangleIcon,
    comentario: ChatBubbleLeftIcon,
    adjunto: PaperClipIcon,
    resolucion: CheckCircleIcon
  }
  return icons[tipo] || PlusCircleIcon
}
</script>
