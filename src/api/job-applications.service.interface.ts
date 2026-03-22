import type { CreateJobApplication } from '@/models/create-job-application.dto'
import type { JobApplication } from '@/models/job-application.dto'
import type { UpdateJobApplication } from '@/models/update-job-application.dto'

export interface JobApplicationsService {
  create(data: CreateJobApplication): Promise<JobApplication>
  update(data: JobApplication): Promise<JobApplication>
  updatePartial(id: string, data: UpdateJobApplication): Promise<JobApplication>
}
