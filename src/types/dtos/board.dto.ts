import type { BaseDto } from './base.dto'
import type { BoardColumn } from './board-column.dto'

export interface Board extends BaseDto {
  name: string
  isArchived: boolean
  columns: BoardColumn[]
}
