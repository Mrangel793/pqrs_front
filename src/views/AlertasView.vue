<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Alertas de Casos</h1>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            :checked="alertasStore.soloMisCasos"
            class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            @change="handleToggleMisCasos"
          />
          <span class="text-sm text-gray-700">Solo mis casos</span>
        </label>
      </div>

      <!-- Cards de resumen -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <DocumentTextIcon class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-xs text-gray-500">Total Casos</p>
            <p class="text-xl font-bold text-gray-900">
              {{ alertasStore.bandeja?.total_casos || 0 }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div
            class="h-10 w-10 rounded-lg flex items-center justify-center"
            style="background-color: #DC354520"
          >
            <ExclamationCircleIcon class="h-5 w-5" style="color: #DC3545" />
          </div>
          <div>
            <p class="text-xs text-gray-500">Vencidos</p>
            <p class="text-xl font-bold" style="color: #DC3545">
              {{ alertasStore.bandeja?.casos_vencidos || 0 }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div
            class="h-10 w-10 rounded-lg flex items-center justify-center"
            style="background-color: #FFC10720"
          >
            <ClockIcon class="h-5 w-5" style="color: #FD7E14" />
          </div>
          <div>
            <p class="text-xs text-gray-500">Por Vencer</p>
            <p class="text-xl font-bold" style="color: #FD7E14">
              {{ alertasStore.bandeja?.casos_por_vencer || 0 }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div class="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircleIcon class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-xs text-gray-500">Activos</p>
            <p class="text-xl font-bold text-green-600">
              {{ alertasStore.bandeja?.casos_activos || 0 }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <BaseCard>
        <TabGroup :selected-index="selectedTab" @change="handleTabChange">
          <TabList class="flex space-x-1 border-b border-gray-200 mb-4">
            <Tab
              v-slot="{ selected }"
              as="template"
            >
              <button
                :class="[
                  'px-4 py-2.5 text-sm font-medium leading-5 focus:outline-none',
                  selected
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                Vencidos
                <span
                  v-if="alertasStore.bandeja?.casos_vencidos"
                  class="ml-2 px-2 py-0.5 text-xs rounded-full text-white"
                >
                </span>
              </button>
            </Tab>
            <Tab
              v-slot="{ selected }"
              as="template"
            >
              <button
                :class="[
                  'px-4 py-2.5 text-sm font-medium leading-5 focus:outline-none',
                  selected
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                Por Vencer
                <span
                  v-if="alertasStore.bandeja?.casos_por_vencer"
                  class="ml-2 px-2 py-0.5 text-xs text-gray-900"
                >
                </span>
              </button>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <AlertaTabla
                :casos="alertasStore.casosVencidos"
                :loading="alertasStore.loading"
                empty-message="No hay casos vencidos"
                @ver-caso="handleVerCaso"
              />
              <BasePagination
                v-if="alertasStore.totalPagesVencidos > 1"
                :current-page="alertasStore.pageVencidos"
                :total-pages="alertasStore.totalPagesVencidos"
                :total="alertasStore.totalVencidos"
                :page-size="alertasStore.pageSizeVencidos"
                @previous="handlePreviousVencidos"
                @next="handleNextVencidos"
                @goto="handleGoToPageVencidos"
              />
            </TabPanel>
            <TabPanel>
              <AlertaTabla
                :casos="alertasStore.casosPorVencer"
                :loading="alertasStore.loading"
                empty-message="No hay casos por vencer"
                @ver-caso="handleVerCaso"
              />
              <BasePagination
                v-if="alertasStore.totalPagesPorVencer > 1"
                :current-page="alertasStore.pagePorVencer"
                :total-pages="alertasStore.totalPagesPorVencer"
                :total="alertasStore.totalPorVencer"
                :page-size="alertasStore.pageSizePorVencer"
                @previous="handlePreviousPorVencer"
                @next="handleNextPorVencer"
                @goto="handleGoToPagePorVencer"
              />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import {
  DocumentTextIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import AlertaTabla from '@/components/alertas/AlertaTabla.vue'
import { useAlertasStore } from '@/stores/alertas'

const router = useRouter()
const alertasStore = useAlertasStore()
const selectedTab = ref(0)

onMounted(() => {
  alertasStore.cargarTodo()
})

// Watch para recargar cuando cambia soloMisCasos
watch(
  () => alertasStore.soloMisCasos,
  () => {
    alertasStore.cargarTodo()
  }
)

function handleToggleMisCasos(event: Event) {
  const target = event.target as HTMLInputElement
  alertasStore.toggleMisCasos(target.checked)
}

function handleTabChange(index: number) {
  selectedTab.value = index
}

function handleVerCaso(id: string) {
  router.push(`/casos/${id}`)
}

// Paginación vencidos
function handlePreviousVencidos() {
  if (alertasStore.pageVencidos > 1) {
    alertasStore.pageVencidos--
    alertasStore.cargarVencidos()
  }
}

function handleNextVencidos() {
  if (alertasStore.pageVencidos < alertasStore.totalPagesVencidos) {
    alertasStore.pageVencidos++
    alertasStore.cargarVencidos()
  }
}

function handleGoToPageVencidos(page: number) {
  alertasStore.pageVencidos = page
  alertasStore.cargarVencidos()
}

// Paginación por vencer
function handlePreviousPorVencer() {
  if (alertasStore.pagePorVencer > 1) {
    alertasStore.pagePorVencer--
    alertasStore.cargarPorVencer()
  }
}

function handleNextPorVencer() {
  if (alertasStore.pagePorVencer < alertasStore.totalPagesPorVencer) {
    alertasStore.pagePorVencer++
    alertasStore.cargarPorVencer()
  }
}

function handleGoToPagePorVencer(page: number) {
  alertasStore.pagePorVencer = page
  alertasStore.cargarPorVencer()
}
</script>
