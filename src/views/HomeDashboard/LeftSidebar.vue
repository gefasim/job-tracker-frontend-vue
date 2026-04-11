<script setup lang="ts">
import AboutIcon from '@/assets/icons/AboutIcon.vue'
import BoardIcon from '@/assets/icons/BoardIcon.vue'
import ContactNavTabIcon from '@/assets/icons/ContactNavTabIcon.vue'
import DocumentNavTabIcon from '@/assets/icons/DocumentNavTabIcon.vue'
import ContactUsIcon from '@/assets/icons/ContactUsIcon.vue'
import HowToIcon from '@/assets/icons/HowToIcon.vue'
import LightThemeIcon from '@/LightThemeIcon.vue'
import DarkThemeIcon from '@/assets/icons/DarkThemeIcon.vue'
import { useTheme } from '@/store/themeStore'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useBoards } from '@/store/boardStore'
import CreateBoardModal from './Board/CreateBoardModal.vue'
import type { Board } from '@/models/board.dto'
import DeleteIcon from '@/assets/icons/DeleteIcon.vue'
import { useUser } from '@/store/userStore'
import { useCurrentBoard } from '@/store/currentBoardStore'
import { useDocumentStore } from '@/store/documentStore'
import { useContacts } from '@/store/contactStore'

const { isDark, theme, themeOptions, setTheme, clearTheme } = useTheme()
const { boards, updateBoard, clearBoards } = useBoards()
const { logout, clearUser } = useUser()
const { clearCurrentBoard } = useCurrentBoard()
const { clearDocuments } = useDocumentStore()
const { clearContacts } = useContacts()
const router = useRouter()
const isCreateBoardModalOpen = ref(false)

const switchTheme = () => {
  const currentIndex = themeOptions.indexOf(theme.value)
  const nextIndex = (currentIndex + 1) % themeOptions.length
  setTheme(themeOptions[nextIndex]!)
}

const onBoardCreated = (board: Board) => {
  isCreateBoardModalOpen.value = false
  router.push({ name: 'board', params: { boardId: board.id } })
}

const handleArchive = async (boardId: string) => {
  if (confirm('Are you sure you want to archive this board?')) {
    await updateBoard(boardId, { isArchived: true })
  }
}

const handleLogout = () => {
  logout()
  clearAllData()
  router.push({ name: 'login' })
}

const clearAllData = () => {
  clearUser()
  clearBoards()
  clearCurrentBoard()
  clearDocuments()
  clearContacts()
  clearTheme()
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
        class="sidebar-item board-sidebar-item"
        active-class="active"
      >
        <div class="board-item-content">
          <span class="board-name"><BoardIcon /> {{ board.name }}</span>
        </div>
        <button class="archive-board-btn" @click.prevent="handleArchive(board.id)">
          <DeleteIcon />
        </button>
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
      <RouterLink to="/account" class="sidebar-item" active-class="active">
        Personal Account
      </RouterLink>
      <div class="sidebar-item" @click="handleLogout">Log Out</div>
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
  max-width: 12rem;

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

.board-sidebar-item {
  justify-content: space-between;
}
.board-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}
.board-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.archive-board-btn {
  background: transparent;
  border: none;
  color: var(--input-text);
  cursor: pointer;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
}
.archive-board-btn:hover {
  background-color: var(--border-color);
  color: #dc2626;
}
.board-sidebar-item:hover .archive-board-btn {
  opacity: 1;
}

/* Boards header */
.boards-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-board-btn {
  background-color: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--input-text);
}

.add-board-btn:hover {
  background-color: color-mix(in srgb, var(--bg-main), black 10%);
  border-color: color-mix(in srgb, var(--border-color), black 10%);
}

html.dark .add-board-btn:hover {
  background-color: color-mix(in srgb, var(--bg-main), white 10%);
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
