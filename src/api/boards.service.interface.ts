import type { Board } from '@/models/board.dto'

export interface BoardsService {
  getAll(): Promise<Board[]>
  get(boardId: string): Promise<Board>
}
