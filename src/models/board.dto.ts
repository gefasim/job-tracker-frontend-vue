import type { BaseDto } from './base.dto'

export interface Board extends BaseDto {
  name: string
  isArchived: boolean
}
