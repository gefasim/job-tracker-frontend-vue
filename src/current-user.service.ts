import type { User } from './models/user.dto'

const USER_KEY = 'current_user'

export class CurrentUserService {
  static getUser(): User | null {
    const data = localStorage.getItem(USER_KEY)
    if (!data) return null

    try {
      return JSON.parse(data) as User
    } catch (error) {
      return null
    }
  }

  static setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  static clearUser(): void {
    localStorage.removeItem(USER_KEY)
  }
}
