import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const modalOpen = ref(false)
  const modalComponent = ref<string | null>(null)
  const modalProps = ref<Record<string, any>>({})

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function openSidebar() {
    sidebarOpen.value = true
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  function openModal(component: string, props: Record<string, any> = {}) {
    modalComponent.value = component
    modalProps.value = props
    modalOpen.value = true
  }

  function closeModal() {
    modalOpen.value = false
    setTimeout(() => {
      modalComponent.value = null
      modalProps.value = {}
    }, 300) // Wait for animation
  }

  return {
    sidebarOpen,
    modalOpen,
    modalComponent,
    modalProps,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    openModal,
    closeModal
  }
})
