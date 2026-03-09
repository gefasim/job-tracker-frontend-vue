import type { User } from '@/models/user.dto'

export interface AuthService {
  login(email: string, password: string): Promise<User>
}
