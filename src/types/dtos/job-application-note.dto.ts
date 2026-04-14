import type { BaseDto } from './base.dto'

export interface JobApplicationNote extends BaseDto {
  jobApplicationId: string
  content: string | null
  order: number
}
