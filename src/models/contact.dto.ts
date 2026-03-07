import type { BaseDto } from './base.dto'
import type { Board } from './board.dto'
import type { Company } from './company.dto'
import type { ContactEmail } from './contact-email.dto'
import type { ContactPhone } from './contact-phone.dto'
import type { JobApplication } from './job-application.dto'

export interface Contact extends BaseDto {
  firstName: string
  lastName: string
  jobTitle: string
  board: Board
  jobApplications: JobApplication[]
  emails: ContactEmail[]
  phones: ContactPhone[]
  companies: Company[]
  twitterUrl: string
  facebookUrl: string
  linkedinUrl: string
  githubUrl: string
  comment: string
  photoUrl: string
  location: string
}
