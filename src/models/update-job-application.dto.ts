import type { JobApplicationStatusType } from './job-application-status.enum'

export interface UpdateJobApplication {
  title?: string
  description?: string
  companyId?: string
  columnId?: string
  postUrl?: string
  salary?: string
  location?: string
  color?: string
  deadline?: string
  status?: JobApplicationStatusType
}
