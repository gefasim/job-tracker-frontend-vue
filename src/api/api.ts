import { authApi } from './auth.api'
import { boardApi } from './boards.api'
import { jobApplicationApi } from './job-applications.api'
import { jobApplicationNoteApi } from './job-notes.api'
import { contactApi } from './contacts.api'
import { documentApi } from './documents.api'
import { companyApi } from './companies.api'

export const api = {
  auth: authApi,
  boards: boardApi,
  jobs: jobApplicationApi,
  jobNotes: jobApplicationNoteApi,
  contacts: contactApi,
  documents: documentApi,
  companies: companyApi,
}
