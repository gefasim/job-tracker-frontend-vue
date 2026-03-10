import type { JobApplicationNote } from '@/models/job-application-note.dto'

export interface JobApplicationNotesService {
  get(jobId: string): Promise<JobApplicationNote>
  create(jobId: string, content: string): Promise<JobApplicationNote>
  update(jobId: string, content: string): Promise<JobApplicationNote>
  delete(noteId: string): Promise<void>
}
