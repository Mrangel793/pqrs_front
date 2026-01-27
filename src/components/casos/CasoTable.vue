<template>
  <BaseTable :columns="columns" :data="casos" :loading="loading">
    <template #cell-numero="{ value }">
      <span class="font-mono text-sm">{{ value }}</span>
    </template>

    <template #cell-tipo="{ row }">
      <BaseBadge :color="getTipoCasoColor(row.tipo)" size="sm">
        {{ formatTipoCaso(row.tipo) }}
      </BaseBadge>
    </template>

    <template #cell-estado="{ row }">
      <EstadoBadge :estado="row.estado" size="sm" />
    </template>

    <template #cell-prioridad="{ row }">
      <BaseBadge :color="getPrioridadColor(row.prioridad)" size="sm">
        {{ formatPrioridad(row.prioridad) }}
      </BaseBadge>
    </template>

    <template #cell-semaforo="{ row }">
      <SemaforoIndicator :estado="row.semaforoEstado" show-label />
    </template>

    <template #cell-fechaRecepcion="{ value }">
      {{ formatDate(value) }}
    </template>

    <template #cell-agenteAsignado="{ row }">
      {{ row.agenteAsignado?.nombre || 'Sin asignar' }}
    </template>

    <template #actions="{ row }">
      <div class="flex gap-2">
        <BaseButton size="sm" variant="ghost" @click="$emit('view', row.id)">
          Ver
        </BaseButton>
        <BaseButton size="sm" variant="ghost" @click="$emit('edit', row.id)">
          Editar
        </BaseButton>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import BaseTable from '@/components/common/BaseTable.vue'
import BaseBadge from '@/components/common/BaseBadge.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import EstadoBadge from './EstadoBadge.vue'
import SemaforoIndicator from './SemaforoIndicator.vue'
import {
  formatDate,
  formatTipoCaso,
  formatPrioridad,
  getTipoCasoColor,
  getPrioridadColor
} from '@/utils/helpers'
import type { Caso } from '@/types'

interface Props {
  casos: Caso[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

defineEmits<{
  view: [id: number | string]
  edit: [id: number | string]
}>()

const columns = [
  { key: 'numero', label: 'Número' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'titulo', label: 'Título' },
  // { key: 'estado', label: 'Estado' },
  { key: 'prioridad', label: 'Prioridad' },
  { key: 'semaforo', label: 'Semáforo' },
  // { key: 'fechaRecepcion', label: 'Fecha' },
  // { key: 'agenteAsignado', label: 'Agente' }
]
</script>
