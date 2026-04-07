import { authApi } from './auth.api'
import { boardApi } from './boards.api'
import { companyApi } from './companies.api'
import { contactApi } from './contacts.api'
import { documentApi } from './documents.api'
import { jobApplicationApi } from './job-applications.api'
import { jobApplicationNoteApi } from './job-notes.api'
import { userApi } from './user.api'

export const api = {
  auth: authApi,
  boards: boardApi,
  companies: companyApi,
  contacts: contactApi,
  documents: documentApi,
  jobNotes: jobApplicationNoteApi,
  jobs: jobApplicationApi,
  users: userApi,
}
