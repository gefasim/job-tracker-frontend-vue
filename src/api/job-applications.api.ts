import { httpClient } from './http-client'
import type { JobApplication } from '@/models/job-application.dto'
import type { CreateJobApplication } from '@/models/create-job-application.dto'
import type { UpdateJobApplication } from '@/models/update-job-application.dto'

export const jobApplicationApi = {
  async get(jobId: string): Promise<JobApplication> {
    const response = await httpClient.get<JobApplication>(`/job-applications/${jobId}`)
    return response.data
  },

  async create(data: CreateJobApplication): Promise<JobApplication> {
    const response = await httpClient.post<JobApplication>(`/job-applications/`, data)
    return response.data
  },

  async update(data: JobApplication): Promise<JobApplication> {
    const response = await httpClient.put<JobApplication>(`/job-applications/${data.id}`, data)
    return response.data
  },

  async updatePartial(id: string, data: UpdateJobApplication): Promise<JobApplication> {
    const response = await httpClient.put<JobApplication>(`/job-applications/${id}`, data)
    return response.data
  },
}
