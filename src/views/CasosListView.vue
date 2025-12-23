<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Casos PQR</h1>
        <BaseButton @click="router.push('/casos/nuevo')">
          Nuevo Caso
        </BaseButton>
      </div>

      <CasoFilters v-model="filters" />

      <BaseCard>
        <CasoTable
          :casos="casosStore.casos"
          :loading="casosStore.loading"
          @view="handleView"
          @edit="handleEdit"
        />

        <BasePagination
          v-if="casosStore.totalPages > 1"
          :current-page="pagination.page"
          :total-pages="casosStore.totalPages"
          :total="casosStore.total"
          :page-size="pagination.pageSize"
          @previous="handlePrevious"
          @next="handleNext"
          @goto="handleGoToPage"
        />
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import CasoFilters from '@/components/casos/CasoFilters.vue'
import CasoTable from '@/components/casos/CasoTable.vue'
import { useCasosStore } from '@/stores/casos'
import type { CasoFilters as ICasoFilters } from '@/types'

const router = useRouter()
const casosStore = useCasosStore()

const filters = ref<ICasoFilters>({})
const pagination = ref({
  page: 1,
  pageSize: 10
})

async function loadCasos() {
  await casosStore.listar(filters.value, pagination.value)
}

watch([filters, pagination], loadCasos, { deep: true })

onMounted(loadCasos)

function handleView(id: number) {
  router.push(`/casos/${id}`)
}

function handleEdit(id: number) {
  router.push(`/casos/${id}/editar`)
}

function handlePrevious() {
  if (pagination.value.page > 1) {
    pagination.value.page--
  }
}

function handleNext() {
  if (pagination.value.page < casosStore.totalPages) {
    pagination.value.page++
  }
}

function handleGoToPage(page: number) {
  pagination.value.page = page
}
</script>
