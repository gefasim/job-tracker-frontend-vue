import axios from 'axios'
import type { JobApplication } from '../models/job-application.dto'
import type { JobApplicationsService } from './job-applications.service.interface'
import type { BoardsService } from './boards.service.interface'
import type { Board } from '@/models/board.dto'
import type { AuthService } from './auth.service.interface'
import type { User } from '@/models/user.dto'
import type { JobApplicationNotesService } from './job-notes.service.interface'
import type { JobApplicationNote } from '@/models/job-application-note.dto'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// interceptors for expired JWT ACCESS_TOKEN
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    debugger
    const originalRequest = error.config

    // Checks if it is a 401 error, and if we have not already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await axios.post(
          import.meta.env.VITE_API_URL + '/auth/refresh',
          {},
          { withCredentials: true },
        )

        return httpClient(originalRequest)
      } catch (refreshError) {
        // TODO: verify with JWT with 1m expiration time
        console.error('Session ended. Login required.')
        // window.location.href = '/login';
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

const authApi: AuthService = {
  async login(email, password): Promise<User> {
    const response = await httpClient.post(`/auth/login`, { email, password })
    return response.data
  },
}

const boardApi: BoardsService = {
  async getAll(): Promise<Board[]> {
    const response = await httpClient.get<Board[]>(`/boards`)
    return response.data
  },
  async get(boardId: string): Promise<Board> {
    const response = await httpClient.get<Board>(`/boards/${boardId}`)
    return response.data
  },
}

const jobApplicationApi: JobApplicationsService = {
  async update(data: JobApplication): Promise<JobApplication> {
    const response = await httpClient.put<JobApplication>(`/job-applications/${data.id}`, data)
    return response.data
  },
  async updatePartial(id: string, data: JobApplication): Promise<JobApplication> {
    const response = await httpClient.patch<JobApplication>(`/job-applications/${id}`, data)
    return response.data
  },
}

const jobApplicationNoteApi: JobApplicationNotesService = {
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
}

export const api = {
  auth: authApi,
  boards: boardApi,
  jobs: jobApplicationApi,
  jobNotes: jobApplicationNoteApi,
}
