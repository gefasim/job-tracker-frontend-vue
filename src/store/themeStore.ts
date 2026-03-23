import { ref } from 'vue'

const theme = ref(localStorage.getItem('theme') || 'system')

export const useTheme = () => {
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }

  const applyTheme = () => {
    const isDark =
      theme.value === 'dark' ||
      (theme.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    // Toggle the .dark class on the <html> element
    document.documentElement.classList.toggle('dark', isDark)
  }

  return { theme, setTheme, applyTheme }
}
