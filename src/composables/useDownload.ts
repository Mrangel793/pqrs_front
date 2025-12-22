import { ref } from 'vue'
import { downloadFile } from '@/utils/helpers'
import { useToast } from './useToast'

export function useDownload() {
  const isDownloading = ref(false)
  const toast = useToast()

  async function download(
    downloadFn: () => Promise<Blob>,
    filename: string
  ): Promise<boolean> {
    try {
      isDownloading.value = true
      const blob = await downloadFn()
      downloadFile(blob, filename)
      toast.success('Descarga completada')
      return true
    } catch (error) {
      console.error('Error al descargar archivo:', error)
      toast.error('Error al descargar el archivo')
      return false
    } finally {
      isDownloading.value = false
    }
  }

  return {
    isDownloading,
    download
  }
}
