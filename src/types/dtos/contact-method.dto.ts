import type { BaseDto } from './base.dto'
import type { ContactMethodTypeEnum } from './contact-type.enum'

export interface ContactMethod extends BaseDto {
  type: ContactMethodTypeEnum
}
