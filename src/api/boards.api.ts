import { httpClient } from './http-client'
import type { Board } from '@/models/board.dto'
import type { UpdateBoard } from '@/models/update-board.dto'

export const boardApi = {
  async getAll(): Promise<Board[]> {
    const response = await httpClient.get<Board[]>(`/boards`, { params: { include: 'columns' } })
    return response.data
  },

  async get(boardId: string): Promise<Board> {
    const response = await httpClient.get<Board>(`/boards/${boardId}`)
    return response.data
  },

  async getAllData(): Promise<Board[]> {
    const response = await httpClient.get<Board[]>(`/boards-all`)
    return response.data
  },

  async createBoard(boardName: string): Promise<Board> {
    const response = await httpClient.post<Board>(`/boards`, { name: boardName })
    return response.data
  },

  async updateBoard(boardId: string, boardData: UpdateBoard): Promise<Board> {
    const response = await httpClient.patch<Board>(`/boards/${boardId}`, boardData)
    return response.data
  },
}
