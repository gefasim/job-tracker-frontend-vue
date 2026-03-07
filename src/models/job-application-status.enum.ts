export enum JobApplicationStatusEnum {
  JobCreated = 'Job Created',
  Deadline = 'Deadline',
  Applied = 'Applied',
  Interview = 'Interview',
  OfferReceived = 'Offer Received',
  JobMoved = 'Job Moved',
}

export type JobApplicationStatusType = `${JobApplicationStatusEnum}`
