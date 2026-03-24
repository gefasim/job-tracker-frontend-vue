import { ref } from 'vue'
import type { Board } from '@/models/board.dto'
import { api } from '@/api/api'

const BOARDS_KEY = 'boards'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

const boards = ref<Board[]>([])
let isFetched = false

const loadFromCache = (): Board[] | null => {
  try {
    const cached = localStorage.getItem(BOARDS_KEY)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(BOARDS_KEY)
      return null
    }

    return data as Board[]
  } catch (error) {
    console.warn('Failed to load boards from cache:', error)
    localStorage.removeItem(BOARDS_KEY)
    return null
  }
}

const saveToCache = (data: Board[]) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(BOARDS_KEY, JSON.stringify(cacheData))
  } catch (error) {
    console.warn('Failed to save boards to cache:', error)
  }
}

const fetchBoards = async () => {
  if (isFetched) return
  try {
    // TODO: Replace with GET /boards + GET /boards/{id}/columns to reduce payload size
    // CreateJobApplicationModal.vue requires columns data to populate dropdown
    boards.value = await api.boards.getAllData()
    isFetched = true
    saveToCache(boards.value)
  } catch (error) {
    console.error('Failed to fetch boards:', error)
  }
}

export const useBoards = () => {
  // Load from cache first
  const cachedBoards = loadFromCache()
  if (cachedBoards) {
    boards.value = cachedBoards
  }

  // Fetch fresh data if not already fetched
  if (!isFetched) {
    fetchBoards()
  }

  return {
    boards,
    fetchBoards,
  }
}
