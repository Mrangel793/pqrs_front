<template>
  <BaseCard title="Información del Caso">
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">Número</p>
          <p class="font-mono text-sm font-medium">{{ caso.numero }}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Tipo</p>
          <BaseBadge :color="getTipoCasoColor(caso.tipo)">
            {{ formatTipoCaso(caso.tipo) }}
          </BaseBadge>
        </div>
        <div>
          <p class="text-sm text-gray-500">Estado</p>
          <EstadoBadge :estado="caso.estado" />
        </div>
        <div>
          <p class="text-sm text-gray-500">Prioridad</p>
          <BaseBadge :color="getPrioridadColor(caso.prioridad)">
            {{ formatPrioridad(caso.prioridad) }}
          </BaseBadge>
        </div>
        <div>
          <p class="text-sm text-gray-500">Semáforo</p>
          <SemaforoIndicator :estado="caso.semaforoEstado" show-label />
        </div>
        <div>
          <p class="text-sm text-gray-500">Agente Asignado</p>
          <p class="font-medium">{{ caso.agenteAsignado?.nombre || 'Sin asignar' }}</p>
        </div>
      </div>

      <div class="border-t pt-4">
        <h4 class="font-medium mb-2">Ciudadano</h4>
        <div class="space-y-1">
          <p class="text-sm"><span class="text-gray-500">Nombre:</span> {{ caso.ciudadanoNombre }}</p>
          <p class="text-sm"><span class="text-gray-500">Email:</span> {{ caso.ciudadanoEmail }}</p>
          <p v-if="caso.ciudadanoTelefono" class="text-sm">
            <span class="text-gray-500">Teléfono:</span> {{ caso.ciudadanoTelefono }}
          </p>
        </div>
      </div>

      <div class="border-t pt-4">
        <h4 class="font-medium mb-2">Fechas</h4>
        <div class="space-y-1">
          <p class="text-sm">
            <span class="text-gray-500">Creación:</span> {{ formatDateTime(caso.fechaCreacion) }}
          </p>
          <p class="text-sm">
            <span class="text-gray-500">Límite:</span> {{ formatDateTime(caso.fechaLimite) }}
          </p>
          <p class="text-sm">
            <span class="text-gray-500">Última actualización:</span> {{ formatRelativeTime(caso.fechaUltimaActualizacion) }}
          </p>
        </div>
      </div>

      <div class="border-t pt-4">
        <h4 class="font-medium mb-2">Descripción</h4>
        <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ caso.descripcion }}</p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '@/components/common/BaseCard.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import EstadoBadge from './EstadoBadge.vue'
import SemaforoIndicator from './SemaforoIndicator.vue'
import {
  formatDateTime,
  formatRelativeTime,
  formatTipoCaso,
  formatPrioridad,
  getTipoCasoColor,
  getPrioridadColor
} from '@/utils/helpers'
import type { Caso } from '@/types'

interface Props {
  caso: Caso
}

defineProps<Props>()
</script>
