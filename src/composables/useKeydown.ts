import { onMounted, onUnmounted } from 'vue'

export function useKeydown(key: string, callback: () => void) {
  const handler = (event: KeyboardEvent) => {
    if (event.key === key) callback()
  }

  onMounted(() => window.addEventListener('keydown', handler))
  onUnmounted(() => window.removeEventListener('keydown', handler))
}
