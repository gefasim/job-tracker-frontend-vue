import { httpClient } from './http-client'
import type { User } from '@/types/dtos/user/user.dto'

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const response = await httpClient.post(`/auth/login`, { email, password })
    return response.data
  },
  async logout(): Promise<void> {
    await httpClient.post(`/auth/logout`)
  },
  async profile(): Promise<void> {
    await httpClient.get(`/auth/profile`)
  },
}
