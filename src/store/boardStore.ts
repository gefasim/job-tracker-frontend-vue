import { ref } from 'vue'
import type { Board } from '@/models/board.dto'
import { api } from '@/api/api'

const boards = ref<Board[]>([])
let isFetched = false

const fetchBoards = async () => {
  if (isFetched) return
  try {
    boards.value = await api.boards.getAllData()
    isFetched = true
  } catch (error) {
    console.error('Failed to fetch boards:', error)
  }
}

export const useBoards = () => {
  if (!isFetched) {
    debugger
    fetchBoards()
  }

  return {
    boards,
    fetchBoards,
  }
}
