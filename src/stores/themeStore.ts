import { ref, computed, watch } from 'vue'

export enum ColorScheme {
  LIGHT = 'Light',
  DARK = 'Dark',
  SYSTEM = 'System',
}

const theme = ref<ColorScheme>((localStorage.getItem('theme') as ColorScheme) || ColorScheme.SYSTEM)
const themeOptions = Object.values(ColorScheme)

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const systemIsDark = ref(mediaQuery.matches)

mediaQuery.addEventListener('change', (e) => {
  systemIsDark.value = e.matches
})

const isDark = computed(() => {
  if (theme.value === ColorScheme.DARK) return true
  if (theme.value === ColorScheme.LIGHT) return false
  return systemIsDark.value
})

watch(
  isDark,
  (newIsDark) => {
    document.documentElement.classList.toggle('dark', newIsDark)
  },
  { immediate: true },
)

const clearTheme = () => {
  theme.value = ColorScheme.SYSTEM
  localStorage.removeItem('theme')
}

export const useTheme = () => {
  const setTheme = (newTheme: ColorScheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  return {
    theme,
    themeOptions,
    isDark,
    setTheme,
    clearTheme,
  }
}
