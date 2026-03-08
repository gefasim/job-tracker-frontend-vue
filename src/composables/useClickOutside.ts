import { onMounted, onUnmounted, type Ref } from 'vue'

// Checks whether the click was outside the element
export function useClickOutside(elRef: Ref<HTMLElement | null>, callback: () => void) {
  const handler = (event: MouseEvent) => {
    if (elRef.value && !elRef.value.contains(event.target as Node)) {
      callback()
    }
  }

  onMounted(() => {
    window.addEventListener('mousedown', handler)
  })

  onUnmounted(() => {
    window.removeEventListener('mousedown', handler)
  })
}
