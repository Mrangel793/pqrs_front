import { ref, computed, type Ref } from 'vue'

export interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
}

export function usePagination(options: UsePaginationOptions = {}) {
  const page = ref(options.initialPage || 1)
  const pageSize = ref(options.initialPageSize || 10)
  const total = ref(0)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  const hasNextPage = computed(() => page.value < totalPages.value)
  const hasPreviousPage = computed(() => page.value > 1)

  function nextPage() {
    if (hasNextPage.value) {
      page.value++
    }
  }

  function previousPage() {
    if (hasPreviousPage.value) {
      page.value--
    }
  }

  function goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
      page.value = pageNumber
    }
  }

  function setTotal(newTotal: number) {
    total.value = newTotal
  }

  function setPageSize(newPageSize: number) {
    pageSize.value = newPageSize
    page.value = 1 // Reset to first page when changing page size
  }

  function reset() {
    page.value = options.initialPage || 1
    pageSize.value = options.initialPageSize || 10
    total.value = 0
  }

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage,
    setTotal,
    setPageSize,
    reset
  }
}
