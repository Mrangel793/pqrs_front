<template>
  <BaseCard title="Información del Caso">
    <div class="space-y-4">
      <!-- Título del caso -->
      <div class="bg-gray-50 -mx-4 -mt-4 px-4 py-3 border-b">
        <h3 class="text-lg font-semibold text-gray-900">{{ caso.titulo }}</h3>
      </div>

      <!-- Información principal en grid -->
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
          <span class="text-xs font-semibold uppercase tracking-wide text-gray-700 bg-gray-100 px-2 py-1 rounded">
            {{ caso.codigoEstado || 'SIN ESTADO' }}
          </span>
        </div>
        <div>
          <p class="text-sm text-gray-500">Prioridad</p>
          <div class="flex items-center gap-2">
            <SemaforoIndicator :semaforo="caso.semaforo" :show-label="false" />
            <span class="text-sm font-medium">
              {{ caso.semaforo?.descripcion || caso.prioridad }}
            </span>
          </div>
        </div>
        <div>
          <p class="text-sm text-gray-500">Agente Asignado</p>
          <p class="font-medium">{{ caso.responsable?.nombre || 'Sin asignar' }}</p>
        </div>
      </div>

      <!-- Categoría y Subcategoría -->
      <div class="border-t pt-4">
        <h4 class="font-medium mb-2 flex items-center gap-2">
          <FolderIcon class="h-4 w-4 text-gray-500" />
          Clasificación
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Categoría</p>
            <p class="font-medium">{{ caso.categoria || 'No especificada' }}</p>
          </div>
          <div v-if="caso.subcategoria">
            <p class="text-sm text-gray-500">Subcategoría</p>
            <p class="font-medium">{{ caso.subcategoria }}</p>
          </div>
        </div>
      </div>

      <!-- Etiquetas -->
      <div v-if="caso.etiquetas && caso.etiquetas.length > 0" class="border-t pt-4">
        <h4 class="font-medium mb-2 flex items-center gap-2">
          <TagIcon class="h-4 w-4 text-gray-500" />
          Etiquetas
        </h4>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="etiqueta in caso.etiquetas"
            :key="etiqueta"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ etiqueta }}
          </span>
        </div>
      </div>

      <!-- Ciudadano -->
      <div class="border-t pt-4">
        <h4 class="font-medium mb-2 flex items-center gap-2">
          <UserIcon class="h-4 w-4 text-gray-500" />
          Ciudadano
        </h4>
        <div class="bg-gray-50 rounded-lg p-3 space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 w-20">Nombre:</span>
            <span class="text-sm font-medium">{{ caso.ciudadanoNombre }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500 w-20">Email:</span>
            <a :href="`mailto:${caso.ciudadanoEmail}`" class="text-sm font-medium text-blue-600 hover:underline">
              {{ caso.ciudadanoEmail }}
            </a>
          </div>
          <div v-if="caso.ciudadanoTelefono" class="flex items-center gap-2">
            <span class="text-sm text-gray-500 w-20">Teléfono:</span>
            <a :href="`tel:${caso.ciudadanoTelefono}`" class="text-sm font-medium text-blue-600 hover:underline">
              {{ caso.ciudadanoTelefono }}
            </a>
          </div>
        </div>
      </div>

      <!-- Fechas -->
      <div class="border-t pt-4">
        <h4 class="font-medium mb-2 flex items-center gap-2">
          <CalendarIcon class="h-4 w-4 text-gray-500" />
          Fechas
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Recepción</p>
            <p class="text-sm font-medium">{{ formatDateTime(caso.fechaRecepcion) }}</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Fecha Límite</p>
            <p class="text-sm font-medium" :class="isOverdue ? 'text-red-600' : ''">
              {{ formatDateTime(caso.fechaLimite) }}
            </p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-500 mb-1">Última Actualización</p>
            <p class="text-sm font-medium">{{ formatRelativeTime(caso.fechaUltimaActualizacion) }}</p>
          </div>
        </div>
      </div>

      <!-- Descripción -->
      <div class="border-t pt-4">
        <h4 class="font-medium mb-2 flex items-center gap-2">
          <DocumentTextIcon class="h-4 w-4 text-gray-500" />
          Descripción
        </h4>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ caso.descripcion }}</p>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  FolderIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
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

const props = defineProps<Props>()

const isOverdue = computed(() => {
  if (!props.caso.fechaLimite) return false
  return new Date(props.caso.fechaLimite) < new Date()
})
</script>
