<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column.label }}
          </th>
          <th v-if="$slots.actions" scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-12">
            <BaseLoading text="Cargando..." />
          </td>
        </tr>
        <tr v-else-if="data.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="px-6 py-12">
            <BaseEmptyState
              title="No hay datos"
              description="No se encontraron resultados para mostrar"
            />
          </td>
        </tr>
        <tr
          v-else
          v-for="(row, index) in data"
          :key="index"
          :class="['hover:bg-gray-50', rowClass ? rowClass(row) : '']"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :row="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import BaseLoading from './BaseLoading.vue'
import BaseEmptyState from './BaseEmptyState.vue'

interface Column {
  key: string
  label: string
}

interface Props {
  columns: Column[]
  data: T[]
  loading?: boolean
  rowClass?: (row: T) => string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  rowClass: undefined
})
</script>
