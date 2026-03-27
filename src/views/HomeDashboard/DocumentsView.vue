<script setup lang="ts">
import { useBoards } from '@/store/boardStore'
import { onMounted, ref, computed } from 'vue'
import { api } from '@/api/api'
import type { Document } from '@/models/document.dto'
import type { DocumentCategoryType } from '@/models/document-category.enum'
import DocumentGrid from '../JobApplication/DocumentsTab/DocumentGrid.vue'
import GenericSelector from '../Shared/GenericSelector.vue'
import type { Board } from '@/models/board.dto'

const { boards, fetchBoards } = useBoards()
const boardsWithDocuments = ref<{ board: Board; documents: Document[] }[]>([])
const availableBoards = computed(() => boardsWithDocuments.value.map((b) => b.board))
const selectedCategory = ref<DocumentCategoryType | 'All'>('All')
const selectedBoard = ref<Board | null>(null)

onMounted(async () => {
  await fetchBoards()
  boardsWithDocuments.value = boards.value
    .filter((b) => !b.isArchived)
    .map((board) => ({
      board,
      documents: getDocuments(board.id),
    }))
  // Set first board as default if available
  if (boardsWithDocuments.value.length > 0 && boardsWithDocuments.value[0]) {
    selectedBoard.value = boardsWithDocuments.value[0].board
  }
})

const getDocuments = (boardId: string): Document[] => {
  return boards.value
    .find((b) => b.id === boardId)!
    .columns.flatMap((c) => c.jobApplications)
    .flatMap((j) => j.documents || [])
    .filter((document, index, self) => self.findIndex((c) => c.id === document.id) === index)
}

const getCategoryCount = (category: DocumentCategoryType): number => {
  return filteredDocuments.value.filter((doc) => doc.category === category).length
}

const getAvailableCategories = (): { category: DocumentCategoryType; count: number }[] => {
  const categories = new Set<DocumentCategoryType>()
  filteredDocuments.value.forEach((doc) => {
    categories.add(doc.category)
  })
  return Array.from(categories)
    .map((category) => ({
      category,
      count: getCategoryCount(category),
    }))
    .sort((a, b) => a.category.localeCompare(b.category))
}

const onBoardChange = (board: Board) => {
  selectedBoard.value = board
  selectedCategory.value = 'All'
}

const filteredDocuments = computed(() => {
  if (!selectedBoard.value) return []

  const boardDocuments =
    boardsWithDocuments.value.find((b) => b.board.id === selectedBoard.value!.id)?.documents || []

  if (selectedCategory.value === 'All') {
    return boardDocuments
  }
  return boardDocuments.filter((doc) => doc.category === selectedCategory.value)
})

const getTotalDocumentsCount = (): number => {
  return filteredDocuments.value.length
}

const onDeleteDocument = async (documentId: string) => {
  if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
    await api.documents.delete(documentId)
    // TODO: Remove the deleted document from all job applications in the store to avoid showing stale data until the next fetch
    boardsWithDocuments.value = boardsWithDocuments.value.map((board) => ({
      ...board,
      documents: board.documents.filter((doc) => doc.id !== documentId),
    }))
  }
}
</script>
<template>
  <div class="placeholder-page">
    <h1>Documents</h1>

    <!-- Board Selector -->
    <GenericSelector
      :items="availableBoards"
      :selected-item="selectedBoard"
      label="Select Board:"
      display-property="name"
      value-property="id"
      id="board-select"
      @update:selected-item="onBoardChange"
    />

    <!-- Category Filters -->
    <div v-if="getTotalDocumentsCount() > 0" class="category-filters">
      <button
        class="category-badge"
        :class="{ active: selectedCategory === 'All' }"
        @click="selectedCategory = 'All'"
      >
        <span>All</span>
        <span class="badge-count">{{ getTotalDocumentsCount() }}</span>
      </button>
      <button
        v-for="{ category, count } in getAvailableCategories()"
        :key="category"
        class="category-badge"
        :class="{ active: selectedCategory === category }"
        @click="selectedCategory = category"
      >
        <span>{{ category }}</span>
        <span class="badge-count">{{ count }}</span>
      </button>
    </div>

    <div v-if="selectedBoard">
      <div class="board-header">
        <h2>{{ selectedBoard.name }}</h2>
        <p v-if="filteredDocuments.length == 0">You don't have any documents for this board yet.</p>
      </div>
      <DocumentGrid
        v-if="filteredDocuments.length > 0"
        :documents="filteredDocuments"
        :boardId="selectedBoard.id"
        :jobApplication="null"
        :showUnlinkButton="false"
        :showDeleteButton="true"
        noDocumentsMessage="You don't have any documents for this board yet."
        @save="(_) => {}"
        @delete="onDeleteDocument"
      />
    </div>
  </div>
</template>

<style scoped>
.placeholder-page {
  padding: 2rem;
}

.board-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.board-selector label {
  font-weight: 500;
  color: #202124;
}

.board-dropdown {
  padding: 0.5rem 1rem;
  border: 1px solid #dadce0;
  border-radius: 4px;
  background-color: white;
  font-size: 0.875rem;
  color: #202124;
  cursor: pointer;
  min-width: 200px;
}

.board-dropdown:focus {
  outline: none;
  border-color: #1f73e6;
  box-shadow: 0 0 0 2px rgba(31, 115, 230, 0.2);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;
}

.category-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #e8e8e8;
  border: 2px solid transparent;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  color: #202124;
}

.category-badge:hover {
  background-color: #d8d8d8;
  border-color: #5f6368;
}

.category-badge.active {
  background-color: #1f73e6;
  color: white;
  border-color: #1f73e6;
}

.category-badge.active .badge-count {
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.badge-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.35rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: inherit;
}

.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.board-header p {
  color: #5f6368;
}
</style>
