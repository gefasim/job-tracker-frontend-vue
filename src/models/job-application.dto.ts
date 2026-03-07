import type { BaseDto } from './base.dto'
import type { Company } from './company.dto'
import type { Contact } from './contact.dto'
import type { JobApplicationNote } from './job-application-note.dto'
import type { JobApplicationStatusType } from './job-application-status.enum'

export interface JobApplication extends BaseDto {
  title: string
  description: string | null
  columnId: string
  postUrl: string
  salary: string
  location: string
  color: string
  deadline: string
  notes: JobApplicationNote[] | null
  contacts: Contact[] | null
  company: Company | null
  statusChangedAt: string
  status: JobApplicationStatusType
  documents: Document[]
}
