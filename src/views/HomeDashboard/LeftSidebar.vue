<script setup lang="ts">
import AboutIcon from '@/assets/icons/AboutIcon.vue'
import BoardIcon from '@/assets/icons/BoardIcon.vue'
import ContactNavTabIcon from '@/assets/icons/ContactNavTabIcon.vue'
import DocumentNavTabIcon from '@/assets/icons/DocumentNavTabIcon.vue'
import ContactUsIcon from '@/assets/icons/ContactUsIcon.vue'
import HowToIcon from '@/assets/icons/HowToIcon.vue'
import LightThemeIcon from '@/LightThemeIcon.vue'
import DarkThemeIcon from '@/assets/icons/DarkThemeIcon.vue'
import { useTheme, type ColorScheme } from '@/store/themeStore'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const { isDark, theme, setTheme } = useTheme()
const activeItem = ref<string>('contacts')

const switchTheme = () => {
  const themeOptions: Array<ColorScheme> = ['light', 'dark', 'system']
  const currentIndex = themeOptions.indexOf(theme.value as ColorScheme)
  const nextIndex = (currentIndex + 1) % themeOptions.length
  setTheme(themeOptions[nextIndex]!)
}

const handleItemClick = (item: string) => {
  activeItem.value = item
}
</script>
<template>
  <div class="left-sidebar">
    <div>
      <RouterLink to="/contacts" class="sidebar-item" active-class="active">
        <ContactNavTabIcon /> Contacts
      </RouterLink>
      <RouterLink to="/documents" class="sidebar-item" active-class="active">
        <DocumentNavTabIcon /> Documents
      </RouterLink>
      <hr />
      Your boards:
      <div
        class="sidebar-item"
        :class="{ active: activeItem === 'board1' }"
        @click="handleItemClick('board1')"
      >
        <BoardIcon /> Board1
      </div>
      <div
        class="sidebar-item"
        :class="{ active: activeItem === 'board2' }"
        @click="handleItemClick('board2')"
      >
        <BoardIcon /> Board2
      </div>
      <hr />
      Help
      <RouterLink to="/about" class="sidebar-item" active-class="active">
        <AboutIcon /> About
      </RouterLink>
      <RouterLink to="/contact-us" class="sidebar-item" active-class="active">
        <ContactUsIcon /> Contact Us
      </RouterLink>
      <RouterLink to="/how-to" class="sidebar-item" active-class="active">
        <HowToIcon /> How to?
      </RouterLink>
      <hr />
    </div>
    <div>
      <div class="sidebar-item theme-switch" @click="switchTheme">
        <DarkThemeIcon v-if="isDark" /><LightThemeIcon v-else />
        <span>Theme</span>
        <span class="theme-value">({{ theme }})</span>
      </div>
      <RouterLink to="/personal-account" class="sidebar-item" active-class="active">
        Personal Account Settings
      </RouterLink>
      <div
        class="sidebar-item"
        :class="{ active: activeItem === 'logout' }"
        @click="handleItemClick('logout')"
      >
        Log Out
      </div>
    </div>
  </div>
</template>
<style>
.left-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--border-color);
  min-width: 10vw;
  padding: 0.5rem;
  padding-top: 20px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;

  /* for RouterLink */
  text-decoration: none;
  color: var(--input-text);
}

.sidebar-item:hover {
  background-color: color-mix(in srgb, var(--bg-main), black 10%);
}

html.dark .sidebar-item:hover {
  background-color: color-mix(in srgb, var(--bg-main), white 10%);
}

.theme-value {
  opacity: 0;
  transition:
    opacity 0.2s ease,
    max-width 0.2s ease;
}

.theme-switch:hover .theme-value {
  opacity: 1;
}

.sidebar-item.active {
  border: 1px solid #1a73e8;
  background-color: #2563eb66;
}
</style>
