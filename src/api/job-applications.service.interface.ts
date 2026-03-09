import type { JobApplication } from '@/models/job-application.dto'

export interface JobApplicationsService {
  update(data: JobApplication): Promise<JobApplication>
  updatePartial(id: string, data: Partial<JobApplication>): Promise<JobApplication>
}
