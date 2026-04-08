import { httpClient } from './http-client'
import type { NotificationReport } from '@/models/notification.dto'

export const notificationApi = {
  async getReport(): Promise<NotificationReport> {
    const response = await httpClient.get<NotificationReport>('/notifications/report')
    return response.data
  },

  async saveReport(data: NotificationReport): Promise<NotificationReport> {
    const response = await httpClient.post<NotificationReport>('/notifications/report', data)
    return response.data
  },
}
