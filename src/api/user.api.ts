import type { User } from '@/models/user.dto'
import { httpClient } from './http-client'

export const userApi = {
  async update(user: Partial<User>): Promise<User> {
    const response = await httpClient.patch<User>(`/users`, user)
    return response.data
  },
  async createVerificationCodeForDelete(): Promise<void> {
    await httpClient.post(`/users/delete/create-verification-code`)
  },
  async delete(verificationCode: string): Promise<void> {
    await httpClient.delete(`/users`, {
      data: { code: verificationCode },
    })
  },
}
