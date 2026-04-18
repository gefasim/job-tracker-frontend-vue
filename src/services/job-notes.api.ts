import { httpClient } from './http-client'
import type { JobApplicationNote } from '@/types/dtos/job-application-note.dto'

export const jobApplicationNoteApi = {
  async get(jobId: string): Promise<JobApplicationNote> {
    const response = await httpClient.get<JobApplicationNote>(`/job-application-notes/${jobId}`)
    return response.data
  },

  async create(jobId: string, content: string): Promise<JobApplicationNote> {
    const response = await httpClient.post<JobApplicationNote>(`/job-application-notes`, {
      content,
      jobApplicationId: jobId,
    })
    return response.data
  },

  async update(jobId: string, content: string): Promise<JobApplicationNote> {
    const response = await httpClient.put<JobApplicationNote>(`/job-application-notes/${jobId}`, {
      content,
    })
    return response.data
  },

  async delete(noteId: string): Promise<void> {
    await httpClient.delete<JobApplicationNote>(`/job-application-notes/${noteId}`)
  },
}
