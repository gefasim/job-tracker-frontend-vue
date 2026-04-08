import { httpClient } from './http-client'
import type { User } from '@/models/user/user.dto'

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const response = await httpClient.post(`/auth/login`, { email, password })
    return response.data
  },
}
