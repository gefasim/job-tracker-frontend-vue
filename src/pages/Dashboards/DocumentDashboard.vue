<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { DocumentCategoryType } from '@/types/dtos/document-category.enum'
import DocumentGrid from '@/components/documents/DocumentGrid.vue'
import { useNavbarFilter } from '@/stores/navbarFilterStore'
import { useDocumentStore } from '@/stores/documentStore'

const { documentsByBoard, fetchDocuments, deleteDocument } = useDocumentStore()
const { selectedBoard, textFilter: documentTitleFilter } = useNavbarFilter()
const selectedCategory = ref<DocumentCategoryType | 'All'>('All')

watch(
  selectedBoard,
  async () => {
    if (!selectedBoard.value) return
    await fetchDocuments(selectedBoard.value.id)
  },
  { immediate: true },
)

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

const filteredDocuments = computed(() => {
  if (!selectedBoard.value) return []

  const documents = documentsByBoard.value[selectedBoard.value.id]
  if (!documents) return []

  const filteredByTitle = documents.filter((doc) =>
    doc.title.toLowerCase().includes(documentTitleFilter.value.toLowerCase()),
  )

  if (selectedCategory.value === 'All') {
    return filteredByTitle
  }
  return filteredByTitle.filter((doc) => doc.category === selectedCategory.value)
})

const getTotalDocumentsCount = (): number => {
  return filteredDocuments.value.length
}

const onDeleteDocument = async (documentId: string) => {
  if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
    await deleteDocument(documentId)
  }
}
</script>
<template>
  <div class="placeholder-page">
    <div class="filter">
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
    </div>

    <div v-if="selectedBoard">
      <div class="board-header">
        <h2>{{ selectedBoard.name }}</h2>
      </div>
      <DocumentGrid
        :documents="filteredDocuments"
        :boardId="selectedBoard.id"
        :jobApplication="null"
        :showUnlinkButton="false"
        :showDeleteButton="true"
        noDocumentsMessage="You don't have any documents for this board yet."
        @save="(_: any) => {}"
        @delete="onDeleteDocument"
      />
    </div>
  </div>
</template>

<style scoped>
.placeholder-page {
  padding: 2rem;
}

.filter {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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
  margin: 1rem 0;
}

.board-header p {
  color: #5f6368;
}
</style>
