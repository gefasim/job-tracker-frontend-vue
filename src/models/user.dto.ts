import type { BaseDto } from './base.dto'

export interface User extends BaseDto {
  email: string
  firstName: string
  lastName: string
  profilePicUrl: string
  role: 'admin' | 'user'
}
