import type { User } from '@/models/user/user.dto'
import { httpClient } from './http-client'
import type { UpdateUser } from '@/models/user/update-user.dto'
import type { CreateUserDto } from '@/models/user/create-user.dto'

export const userApi = {
  async create(data: CreateUserDto): Promise<User> {
    const response = await httpClient.post(`/users`, data)
    return response.data
  },
  async update(user: UpdateUser): Promise<User> {
    const response = await httpClient.patch<User>(`/users`, user, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    await httpClient.post(`/users/update-password`, {
      oldPassword,
      newPassword,
    })
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
