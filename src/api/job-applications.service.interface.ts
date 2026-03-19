import type { JobApplication } from '@/models/job-application.dto'
import type { UpdateJobApplication } from '@/models/update-job-application.dto'

export interface JobApplicationsService {
  update(data: JobApplication): Promise<JobApplication>
  updatePartial(id: string, data: UpdateJobApplication): Promise<JobApplication>
}
