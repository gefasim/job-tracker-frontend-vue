import type { ContactMethod } from './contact-method.dto'

export interface ContactEmail extends ContactMethod {
  email: string
}
