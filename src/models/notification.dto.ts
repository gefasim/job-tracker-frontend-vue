export interface DailyNotification {
  time: string
  timezoneOffset: number
}

export interface WeeklyNotification {
  dayOfWeek: string
  time: string
  timezoneOffset: number
}

export interface NotificationReport {
  daily: DailyNotification | null
  weekly: WeeklyNotification | null
}
