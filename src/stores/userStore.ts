import { computed, ref } from 'vue'
import type { User } from '@/types/dtos/user/user.dto'
import { api } from '@/services/api'
import type { UpdateUser } from '@/types/dtos/user/update-user.dto'

const USER_KEY = 'user'
const user = ref<User | null>(null)

const login = async (email: string, password: string) => {
  try {
    const response = await api.auth.login(email, password)
    setUser(response)
  } catch (error) {
    console.error('Failed to login:', error)
    throw error
  }
}

const logout = async () => {
  try {
    await api.auth.logout()
    clearUser()
  } catch (error) {
    console.error('Failed to logout:', error)
    throw error
  }
}

const setUser = (userData: User) => {
  user.value = userData
  localStorage.setItem(USER_KEY, JSON.stringify(userData))
}

const updateUser = async (updatedUser: UpdateUser) => {
  try {
    const response = await api.users.update(updatedUser)
    setUser(response)
  } catch (error) {
    console.error('Failed to update user:', error)
    throw error
  }
}

const clearUser = () => {
  user.value = null
  localStorage.removeItem(USER_KEY)
}

// Checks if the user has an active session by calling API
// instead of relying on the localStorage which might be stale
const hasAnActiveSession = async () => {
  try {
    await api.auth.profile()
    return true
  } catch (error) {
    return false
  }
}

export const useUser = () => {
  const cachedUser = localStorage.getItem(USER_KEY)
  if (cachedUser) {
    user.value = JSON.parse(cachedUser)
  }

  return {
    user,
    login,
    logout,
    setUser,
    updateUser,
    clearUser,
    hasAnActiveSession,
  }
}
