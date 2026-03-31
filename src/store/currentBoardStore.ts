import { ref } from 'vue'
import type { Board } from '@/models/board.dto'
import type { JobApplication } from '@/models/job-application.dto'
import type { CreateJobApplication } from '@/models/create-job-application.dto'
import type { UpdateJobApplication } from '@/models/update-job-application.dto'
import { api } from '@/api/api'

const STORAGE_KEY_PREFIX = 'current-board-'
const CACHE_DURATION = 1 * 60 * 60 * 1000 // 1 hour

const board = ref<Board | null>(null)
let isLoaded = false

const loadFromCache = (boardId: string): Board | null => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY_PREFIX + boardId)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(STORAGE_KEY_PREFIX + boardId)
      return null
    }

    return data as Board
  } catch (error) {
    console.warn('Failed to load board from cache:', error)
    return null
  }
}

const saveToCache = (board: Board) => {
  try {
    const cacheData = {
      data: board,
      timestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY_PREFIX + board.id, JSON.stringify(cacheData))
  } catch (error) {
    console.warn('Failed to save board to cache:', error)
  }
}

const loadBoard = async (boardId: string) => {
  const cachedBoard = loadFromCache(boardId)
  if (cachedBoard) {
    board.value = cachedBoard
  }

  if (isLoaded) return
  try {
    const boardResponse = await api.boards.get(boardId)
    board.value = boardResponse
    isLoaded = true
    saveToCache(boardResponse)
  } catch (error) {
    console.error('Failed to load board:', error)
  }
}

const updateJobApplicationInCache = (jobApplication: JobApplication) => {
  if (board.value) {
    for (const column of board.value.columns) {
      const jobIndex = column.jobApplications.findIndex((j) => j.id === jobApplication.id)
      if (jobIndex !== -1) {
        column.jobApplications[jobIndex] = jobApplication
        saveToCache(board.value)
        break
      }
    }
  }
}

const loadJobApplication = async (jobId: string): Promise<JobApplication> => {
  try {
    const jobApplication = await api.jobs.get(jobId)
    updateJobApplicationInCache(jobApplication)
    return jobApplication
  } catch (error) {
    console.error('Failed to load job application:', error)
    throw error
  }
}

const createJobApplication = async (boardId: string, data: CreateJobApplication) => {
  try {
    const jobApplication = await api.jobs.create(data)
    if (board.value && board.value.id === boardId) {
      const column = board.value.columns.find((c) => c.id === data.columnId)
      if (column) {
        column.jobApplications.push(jobApplication)
        saveToCache(board.value)
      }
    }
    return jobApplication
  } catch (error) {
    console.error('Failed to create job application:', error)
    throw error
  }
}

const updateJobApplication = async (jobId: string, updates: UpdateJobApplication) => {
  try {
    const updated = await api.jobs.updatePartial(jobId, updates)
    updateJobApplicationInCache(updated)
    return updated
  } catch (error) {
    console.error('Failed to update job application:', error)
    throw error
  }
}

const moveJobApplication = async (jobId: string, newColumnId: string) => {
  try {
    const updated = await api.jobs.updatePartial(jobId, { columnId: newColumnId })
    if (board.value) {
      let oldColumn = null
      let jobToMove = null

      // Find and remove from old column
      for (const column of board.value.columns) {
        const jobIndex = column.jobApplications.findIndex((j) => j.id === jobId)
        if (jobIndex !== -1) {
          jobToMove = column.jobApplications.splice(jobIndex, 1)[0]
          oldColumn = column
          break
        }
      }

      // Add to new column
      if (jobToMove) {
        const newColumn = board.value.columns.find((c) => c.id === newColumnId)
        if (newColumn) {
          newColumn.jobApplications.push(jobToMove)
          saveToCache(board.value)
        }
      }
    }
    return updated
  } catch (error) {
    console.error('Failed to move job application:', error)
    throw error
  }
}

const deleteJobApplication = async (jobId: string) => {
  try {
    // Note: API doesn't have delete method shown, adjust based on your API
    if (board.value) {
      for (const column of board.value.columns) {
        const jobIndex = column.jobApplications.findIndex((j) => j.id === jobId)
        if (jobIndex !== -1) {
          column.jobApplications.splice(jobIndex, 1)
          saveToCache(board.value)
          break
        }
      }
    }
  } catch (error) {
    console.error('Failed to delete job application:', error)
    throw error
  }
}

const getJobApplication = (jobId: string): JobApplication | undefined => {
  if (!board.value) return undefined
  for (const column of board.value.columns) {
    const job = column.jobApplications.find((j) => j.id === jobId)
    if (job) return job
  }
  return undefined
}

const clearCache = (boardId?: string) => {
  if (boardId) {
    localStorage.removeItem(STORAGE_KEY_PREFIX + boardId)
  } else {
    // Clear all board caches
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  }
}

export const useCurrentBoard = () => {
  return {
    board,
    loadBoard,
    loadJobApplication,
    createJobApplication,
    updateJobApplication,
    moveJobApplication,
    deleteJobApplication,
    getJobApplication,
    clearCache,
  }
}
