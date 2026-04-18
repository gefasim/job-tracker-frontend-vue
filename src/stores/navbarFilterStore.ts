import type { Board } from '@/types/dtos/board.dto'
import { ref } from 'vue'

const textFilter = ref('')
const selectedBoard = ref<Board | null>(null)

export const useNavbarFilter = () => {
  return {
    textFilter,
    selectedBoard,
  }
}
