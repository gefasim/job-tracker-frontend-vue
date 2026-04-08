import type { User } from '@/models/user/user.dto'
import { httpClient } from './http-client'
import type { UpdateUser } from '@/models/user/update-user.dto'

export const userApi = {
  async update(user: UpdateUser): Promise<User> {
    const response = await httpClient.patch<User>(`/users`, user, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
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
