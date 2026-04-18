import type { ContactMethod } from './contact-method.dto'

export interface ContactPhone extends ContactMethod {
  phone: string
}
