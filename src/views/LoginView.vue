<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Sistema PQR</h1>
          <p class="text-gray-600">Gestión de Casos Escalados</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <BaseInput
            v-model="form.email"
            type="email"
            label="Correo Electrónico"
            placeholder="usuario@ejemplo.com"
            required
            :error="errors.email"
          />

          <BaseInput
            v-model="form.password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            required
            :error="errors.password"
          />

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="loading"
          >
            Iniciar Sesión
          </BaseButton>
        </form>

        <div v-if="authStore.error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-600">{{ authStore.error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = ref({
  email: '',
  password: ''
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)

async function handleLogin() {
  errors.value = {}

  if (!form.value.email) {
    errors.value.email = 'El correo es requerido'
    return
  }

  if (!form.value.password) {
    errors.value.password = 'La contraseña es requerida'
    return
  }

  loading.value = true
  const success = await authStore.login(form.value)
  loading.value = false

  if (success) {
    toast.success('Bienvenido al sistema')
    router.push('/dashboard')
  }
}
</script>
