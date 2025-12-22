<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Mi Perfil</h1>

      <BaseCard title="Información Personal">
        <form @submit.prevent="handleUpdate" class="space-y-4">
          <BaseInput
            v-model="form.nombre"
            label="Nombre"
            required
            :error="errors.nombre"
          />

          <BaseInput
            v-model="form.email"
            type="email"
            label="Correo Electrónico"
            required
            :error="errors.email"
          />

          <div class="pt-4 border-t">
            <BaseButton type="submit" :loading="loading">
              Actualizar Perfil
            </BaseButton>
          </div>
        </form>
      </BaseCard>

      <BaseCard title="Cambiar Contraseña">
        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <BaseInput
            v-model="passwordForm.currentPassword"
            type="password"
            label="Contraseña Actual"
            required
            :error="passwordErrors.currentPassword"
          />

          <BaseInput
            v-model="passwordForm.newPassword"
            type="password"
            label="Nueva Contraseña"
            required
            :error="passwordErrors.newPassword"
          />

          <BaseInput
            v-model="passwordForm.confirmPassword"
            type="password"
            label="Confirmar Contraseña"
            required
            :error="passwordErrors.confirmPassword"
          />

          <div class="pt-4 border-t">
            <BaseButton type="submit" variant="secondary" :loading="passwordLoading">
              Cambiar Contraseña
            </BaseButton>
          </div>
        </form>
      </BaseCard>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()

const form = ref({
  nombre: '',
  email: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = ref<Record<string, string>>({})
const passwordErrors = ref<Record<string, string>>({})
const loading = ref(false)
const passwordLoading = ref(false)

onMounted(() => {
  if (authStore.usuario) {
    form.value.nombre = authStore.usuario.nombre
    form.value.email = authStore.usuario.email
  }
})

async function handleUpdate() {
  errors.value = {}
  loading.value = true

  const success = await authStore.updateProfile(form.value)

  if (success) {
    toast.success('Perfil actualizado exitosamente')
  }

  loading.value = false
}

async function handleChangePassword() {
  passwordErrors.value = {}

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Las contraseñas no coinciden'
    return
  }

  if (passwordForm.value.newPassword.length < 8) {
    passwordErrors.value.newPassword = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  passwordLoading.value = true

  const success = await authStore.changePassword(
    passwordForm.value.currentPassword,
    passwordForm.value.newPassword
  )

  if (success) {
    toast.success('Contraseña cambiada exitosamente')
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  }

  passwordLoading.value = false
}
</script>
