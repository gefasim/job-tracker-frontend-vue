import { computed, ref } from 'vue'
import type { User } from '@/models/user/user.dto'
import { api } from '@/api/api'

const USER_KEY = 'user'
const user = ref<User | null>(null)
const isAuthenticated = computed(() => !!user.value)

const login = async (email: string, password: string) => {
  try {
    const response = await api.auth.login(email, password)
    setUser(response)
  } catch (error) {
    console.error('Failed to login:', error)
    throw error
  }
}

const setUser = (userData: User) => {
  user.value = userData
  localStorage.setItem(USER_KEY, JSON.stringify(userData))
}

const clearUser = () => {
  user.value = null
  localStorage.removeItem(USER_KEY)
}

export const useUser = () => {
  const cachedUser = localStorage.getItem(USER_KEY)
  if (cachedUser) {
    user.value = JSON.parse(cachedUser)
  }

  return {
    user,
    isAuthenticated,
    login,
    setUser,
    clearUser,
  }
}
