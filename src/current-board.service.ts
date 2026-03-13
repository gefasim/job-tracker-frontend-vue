import type { Board } from './models/board.dto'

const BOARD_KEY = 'current_board'

export class CurrentBoard {
  static getBoard(): Board | null {
    const data = localStorage.getItem(BOARD_KEY)
    if (!data) return null

    try {
      return JSON.parse(data) as Board
    } catch (error) {
      return null
    }
  }

  static setBoard(board: Board): void {
    localStorage.setItem(BOARD_KEY, JSON.stringify(board))
  }

  static clearBoard(): void {
    localStorage.removeItem(BOARD_KEY)
  }
}
