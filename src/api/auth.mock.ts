import type { Usuario, LoginCredentials, AuthResponse } from '@/types'

// Mock data para desarrollo sin backend
const MOCK_USUARIO: Usuario = {
    id: 1,
    email: 'admin@pqr.com',
    nombre: 'Admin Sistema',
    rol: 'admin',
    activo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}

const MOCK_TOKEN = 'mock-jwt-token-for-development'

export const mockAuthApi = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500))

        // Cualquier credencial funciona en modo mock
        console.log('🎭 Mock Login:', credentials.email)

        return {
            token: MOCK_TOKEN,
            usuario: MOCK_USUARIO
        }
    },

    async logout(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300))
        console.log('🎭 Mock Logout')
    },

    async getProfile(): Promise<Usuario> {
        await new Promise(resolve => setTimeout(resolve, 300))
        console.log('🎭 Mock Get Profile')
        return MOCK_USUARIO
    },

    async updateProfile(updates: Partial<Usuario>): Promise<Usuario> {
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log('🎭 Mock Update Profile:', updates)
        return { ...MOCK_USUARIO, ...updates }
    },

    async changePassword(
        currentPassword: string,
        newPassword: string
    ): Promise<{ message: string }> {
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log('🎭 Mock Change Password')
        return { message: 'Contraseña actualizada exitosamente' }
    }
}
