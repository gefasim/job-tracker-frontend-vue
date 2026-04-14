import type { BaseDto } from './base.dto'

export interface Company extends BaseDto {
  name: string
  description: string | null
  url: string | null
  logo: string | null
  industry: string | null
}
