import type { BaseDto } from './base.dto'
import type { JobApplication } from './job-application.dto'

export interface BoardColumn extends BaseDto {
  name: string
  order: number
  boardId: string
  jobApplications: JobApplication[]
}
