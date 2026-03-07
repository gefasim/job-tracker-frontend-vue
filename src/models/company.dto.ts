import type { BaseDto } from './base.dto'
import type { Contact } from './contact.dto'

export interface Company extends BaseDto {
  name: string
  description: string | null
  url: string | null
  logo: string | null
  industry: string | null
  contacts: Contact[]
}
