import { ref, computed, watch } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'system')

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const systemIsDark = ref(mediaQuery.matches)

mediaQuery.addEventListener('change', (e) => {
  systemIsDark.value = e.matches
})

const isDark = computed(() => {
  if (theme.value === 'dark') return true
  if (theme.value === 'light') return false
  return systemIsDark.value
})

watch(
  isDark,
  (newIsDark) => {
    document.documentElement.classList.toggle('dark', newIsDark)
  },
  { immediate: true },
)

export const useTheme = () => {
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  return {
    theme,
    isDark,
    setTheme,
  }
}
