import { ref } from 'vue'
import type { Board } from '@/models/board.dto'
import { api } from '@/api/api'
import type { UpdateBoard } from '@/models/update-board.dto'

const BOARDS_KEY = 'boards'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

const boards = ref<Board[]>([])
const isLoading = ref(false) // prevents multiple simultaneous requests
let isFetched = false // prevents multiple fetches

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
  if (isFetched || isLoading.value) return
  try {
    isLoading.value = true
    boards.value = await api.boards.getAll()
    isFetched = true
    saveToCache(boards.value)
  } catch (error) {
    console.error('Failed to fetch boards:', error)
  } finally {
    isLoading.value = false
  }
}

const createBoard = async (name: string): Promise<Board> => {
  try {
    const createdBoard = await api.boards.createBoard(name)
    boards.value.push(createdBoard)
    saveToCache(boards.value)
    return createdBoard
  } catch (error) {
    console.error('Failed to create board:', error)
    throw error
  }
}

const updateBoard = async (boardId: string, boardData: UpdateBoard): Promise<Board> => {
  try {
    const updatedBoard = await api.boards.updateBoard(boardId, boardData)
    boards.value = boards.value.map((board) => (board.id === boardId ? updatedBoard : board))
    saveToCache(boards.value)
    return updatedBoard
  } catch (error) {
    console.error('Failed to update board:', error)
    throw error
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
    createBoard,
    updateBoard,
  }
}
