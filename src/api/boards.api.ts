import { httpClient } from './http-client'
import type { Board } from '@/models/board.dto'

export const boardApi = {
  async getAll(): Promise<Board[]> {
    const response = await httpClient.get<Board[]>(`/boards`)
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
}
