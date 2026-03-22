import type { BaseDto } from './base.dto'

export interface CreateJobApplication extends BaseDto {
  title: string
  columnId: string
  companyId: string
}
