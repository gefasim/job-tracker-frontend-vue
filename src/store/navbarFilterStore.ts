import { ref } from 'vue'

const textFilter = ref('')

export const useNavbarFilter = () => {
  return {
    textFilter,
  }
}
