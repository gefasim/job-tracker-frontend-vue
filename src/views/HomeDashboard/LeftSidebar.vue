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
import { RouterLink, useRouter } from 'vue-router'
import { useBoards } from '@/store/boardStore'
import CreateBoardModal from './Board/CreateBoardModal.vue'
import type { Board } from '@/models/board.dto'

const { isDark, theme, setTheme } = useTheme()
const { boards } = useBoards()
const router = useRouter()
const activeItem = ref<string>('contacts')
const isCreateBoardModalOpen = ref(false)

const switchTheme = () => {
  const themeOptions: Array<ColorScheme> = ['light', 'dark', 'system']
  const currentIndex = themeOptions.indexOf(theme.value as ColorScheme)
  const nextIndex = (currentIndex + 1) % themeOptions.length
  setTheme(themeOptions[nextIndex]!)
}

const handleItemClick = (item: string) => {
  activeItem.value = item
}

const onBoardCreated = (board: Board) => {
  isCreateBoardModalOpen.value = false
  router.push({ name: 'board', params: { boardId: board.id } })
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

      <div class="boards-header">
        <RouterLink to="/" class="hide-link-decor"> Your boards: </RouterLink>
        <button class="add-board-btn" @click="isCreateBoardModalOpen = true"><b>+</b></button>
      </div>
      <RouterLink
        v-for="board in boards.filter((b) => !b.isArchived).slice(0, 5)"
        :key="board.id"
        :to="`/boards/${board.id}`"
        class="sidebar-item"
        active-class="active"
      >
        <BoardIcon /> {{ board.name }}
      </RouterLink>
      <RouterLink v-if="boards.filter((b) => !b.isArchived).length > 5" to="/" class="sidebar-item">
        See all boards
      </RouterLink>

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

  <Teleport to="body">
    <CreateBoardModal
      v-if="isCreateBoardModalOpen"
      @close="isCreateBoardModalOpen = false"
      @save="onBoardCreated"
  /></Teleport>
</template>
<style>
.left-sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid var(--border-color);
  min-width: 10vw;
  padding: 0.5rem;
  padding-top: 20px;
}

/* Sidebar items */
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

.sidebar-item.active {
  border: 1px solid #1a73e8;
  background-color: #2563eb66;
}

/* Boards header */
.boards-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-board-btn {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
}

.add-board-btn:hover {
  background-color: color-mix(in srgb, var(--bg-card), black 10%);
  border-color: color-mix(in srgb, var(--border-color), black 10%);
}

html.dark .add-board-btn:hover {
  background-color: color-mix(in srgb, var(--bg-card), white 10%);
  border-color: color-mix(in srgb, var(--border-color), white 10%);
}

/* Hide link decor */
.hide-link-decor {
  text-decoration: none;
  color: var(--input-text);
}
.hide-link-decor:hover {
  text-decoration: underline;
}

/* Theme value */
.theme-value {
  opacity: 0;
  transition:
    opacity 0.2s ease,
    max-width 0.2s ease;
}

.theme-switch:hover .theme-value {
  opacity: 1;
}

hr {
  margin: 1rem 0;
}
</style>
