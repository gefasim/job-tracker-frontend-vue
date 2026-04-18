import type { BaseDto } from './base.dto'
import type { Board } from './board.dto'
import type { DocumentCategoryType } from './document-category.enum'
import type { JobApplication } from './job-application.dto'
import type { User } from './user/user.dto'

export interface Document extends BaseDto {
  user: User
  title: string
  category: DocumentCategoryType
  description?: string
  url: string
  fileSize?: number
  fileExtension?: string
  board?: Board
  jobApplications: JobApplication[]
}
